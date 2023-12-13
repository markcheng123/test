import {useNavigate, useParams} from "react-router-dom";
import styles from './ProductForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {createProduct, deleteProduct, selectCategories, selectProductsById, updateProduct} from "../redux/reducer";
import {useEffect, useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductForm = () => {
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
      navigate('/');
    }
  };

  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isFormInValid = !product.title
      || !product.category
      || product.price < 1
      || !product.description
      || (!neverExpires && !product.expiry);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateProduct({ id: Number(id), ...product }));
    } else {
      dispatch(createProduct(product));
    }
    navigate('/');
  };

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
          <Button variant="primary" onClick={() => handleClose(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductForm;
