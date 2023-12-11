import {useNavigate, useParams} from "react-router-dom";
import styles from './ProductForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {createProduct, deleteProduct, selectCategories, selectProductsById, updateProduct} from "../redux/reducer";
import {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductForm = () => {
  const { id } = useParams();

  const categories = useSelector(selectCategories);

  const product = useSelector(selectProductsById(Number(id)));

  const [title, setTitle] = useState(product ? product.title : '');

  const [category, setCategory] = useState(product ? product.category : '');

  const [price, setPrice] = useState(product ? product.price : '');

  const [thumbnail, setThumbnail] = useState(product ? product.thumbnail : '');

  const [description, setDescription] = useState(product ? product.description : '');

  const [neverExpires, setNeverExpires] = useState(product ? !product.expiry : true);

  const [expiry, setExpiry] = useState(product ? product.expiry : '');

  const [special, setSpecial] = useState(product ? product.special : false);

  const [show, setShow] = useState(false);

  const handleClose = (value) => {
    setShow(false);
    if (value) {
      dispatch(deleteProduct(product.id));
      navigate('/');
    }
  };

  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isFormValid = !!title && !!category && (price > 1) && !!description && (neverExpires || (!neverExpires && !!expiry));

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = { title, description, price, category, expiry, special, thumbnail };
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
                   value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Category <span className={styles.required}>*</span></label>
            <select className="form-select" id="category" name="category"
                    value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>Select category</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Price <span className={styles.required}>*</span></label>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">£</span>
              <input type="number" id="price" name="price" min="1" className="form-control"
                     value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
            <input type="text" id="thumbnail" name="thumbnail" className="form-control"
                   value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Description <span className={styles.required}>*</span></label>
            <textarea id="description" name="description" className="form-control"
                      value={description} onChange={(e) => setDescription(e.target.value)}/>
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
            <input className="ms-2" disabled={neverExpires} type="date" id="expiresOn" name="expiresOn"
                   value={expiry} onChange={(e) => setExpiry(e.target.value)}/>
          </div>
          <div className="mb-3">
            <input className="form-check-input" type="checkbox" id="specialProduct" name="specialProduct"
                   checked={special} onChange={(e) => setSpecial(e.target.checked)}/>
            <label className="ms-2 form-check-label" htmlFor="specialProduct">
              Special Product
            </label>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" disabled={!isFormValid} className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete product {product ? product.title : ''}?</Modal.Body>
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
