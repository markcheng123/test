import {useNavigate, useParams} from "react-router-dom";
import styles from './ProductForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {createProduct, deleteProduct, selectCategories, selectProductsById, updateProduct} from "../redux/reducer";
import {useEffect, useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductForm = ({onAlert}) => {
  const { id } = useParams();

  const categories = useSelector(selectCategories);

  const existing = useSelector(selectProductsById(Number(id)));

  const [product, setProduct] = useState(existing || {
    title: '',
    category: '',
    price: '',
    thumbnail: '',
    description: '',
    expiry: '',
    special: false
  });

  const handleChange = (name, value) => {
    setProduct({...product, [name]: value})
  }

  const [neverExpires, setNeverExpires] = useState(existing ? !existing.expiry : true);

  useEffect(() => {
    if (neverExpires) {
      setProduct((p) => ({...p, expiry: ''}));
    }
  }, [neverExpires]);

  const [show, setShow] = useState(false);

  const handleClose = (value) => {
    setShow(false);
    if (value) {
      dispatch(deleteProduct(existing.id));
      onAlert('deleted');
      navigate('/');
    }
  };

  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isFormInValid = !product.title.trim()
      || !product.category.trim()
      || product.price < 1
      || !product.description.trim()
      || (!neverExpires && !product.expiry);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existing) {
      dispatch(updateProduct({ id: existing.id, ...product }));
      onAlert('updated');
    } else {
      dispatch(createProduct(product));
      onAlert('created');
    }
    navigate('/');
  };

  if (typeof id !== 'undefined' && !existing) {
    return <div className={`d-flex flex-column justify-content-center align-items-center ${styles.notFound}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
           className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
        <path
            d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
        <path
            d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
      </svg>
      <div className="mt-3">
        Product not found!
      </div>
      <div className="mt-3">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    </div>;
  }

  return (
    <div className={styles.container}>
      <div className={`d-flex justify-content-between ${styles.header}`}>
        <div>{id ? 'Edit Product' : 'New Product'}</div>
        <div>
          {id && <button type="button" className="btn btn-danger" onClick={handleShow}>Delete Product</button>}
        </div>
      </div>
      <div className={styles.formContainer}>
        <form noValidate onSubmit={handleSubmit} className={styles.form}>
          <div className="mb-3">
            <label className="form-label">Title <span className={styles.required}>*</span></label>
            <input type="text" id="title" name="title" className="form-control"
                   value={product.title} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Category <span className={styles.required}>*</span></label>
            <select className="form-select" id="category" name="category"
                    value={product.category} onChange={(e) => handleChange(e.target.name, e.target.value)}>
              <option value="" disabled>Select category</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Price <span className={styles.required}>*</span></label>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">£</span>
              <input type="number" id="price" name="price" min="1" className="form-control"
                     value={product.price} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
            <input type="text" id="thumbnail" name="thumbnail" className="form-control"
                   value={product.thumbnail} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Description <span className={styles.required}>*</span></label>
            <textarea id="description" name="description" className="form-control"
                      value={product.description} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
          </div>
          <div className="mb-3">
            <input className="form-check-input" type="checkbox" id="neverExpires" name="neverExpires"
                   checked={neverExpires} onChange={(e) => setNeverExpires(e.target.checked)}/>
            <label className="ms-2 form-check-label" htmlFor="neverExpires">
              Never Expires
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Expires on:
            </label>
            <input className="ms-2" disabled={neverExpires} type="date" id="expiry" name="expiry"
                   value={product.expiry} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
          </div>
          <div className="mb-3">
            <input className="form-check-input" type="checkbox" id="special" name="special"
                   checked={product.special} onChange={(e) => handleChange(e.target.name, e.target.checked)}/>
            <label className="ms-2 form-check-label" htmlFor="specialProduct">
              Special Product
            </label>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" disabled={isFormInValid} className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete product {existing ? existing.title : ''}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleClose(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductForm;
