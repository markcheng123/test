import styles from './ProductSummary.module.css';
import { Link } from "react-router-dom";

const ProductSummary = ({product}) => {

  let className = `card shadow ${styles.container}`;
  if (product.special) {
    className += ` ${styles.highlight}`;
  }

  return (
      <div className="col-md-4">
        <div className={className}>
          {product.thumbnail ? <img className="card-img-top" src={product.thumbnail} alt="Product thumbnail" />
              : <div className={`d-flex justify-content-center align-items-center ${styles.noThumbnail}`}>
                Product Image Not Available</div>}
          <div className="card-body d-flex flex-column justify-content-end align-items-center">
            <h5 className="card-title">{product.title}</h5>
            <p className={styles.price}>£{product.price}</p>
            {product.expiry && <p>Expiry date: {product.expiry}</p>}
            <p className="card-text">{product.description}</p>
            <Link to={`/product/${product.id}`} className="btn btn-primary">Edit Product</Link>
          </div>
        </div>
      </div>
  );
};

export default ProductSummary;
