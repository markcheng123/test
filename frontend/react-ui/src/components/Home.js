import styles from './Home.module.css';
import { useSelector } from 'react-redux';
import ProductSummary from "./ProductSummary";
import Dropdown from 'react-bootstrap/Dropdown';
import {useState} from "react";
import {selectCategories, selectProducts} from "../redux/reducer";


const Home = () => {

  const AllCategories = 'all categories';

  const products = useSelector(selectProducts);

  const categories = useSelector(selectCategories);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const [dropdownTitle, setDropdownTitle] = useState(AllCategories);

  const filterHandler = (eventKey, event) => {
    if (eventKey !== dropdownTitle) {
      let filteredProducts;
      if (eventKey === AllCategories) {
        filteredProducts = products;
      } else {
        filteredProducts = products.filter(product => product.category === eventKey);
      }
      setFilteredProducts(filteredProducts);
      setDropdownTitle(eventKey);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`d-flex justify-content-end align-items-center ${styles.filterBar}`}>
        <label>Filter by category:</label>
        <Dropdown onSelect={filterHandler}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {dropdownTitle}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey={AllCategories}>{AllCategories}</Dropdown.Item>
            {categories.map(category => <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className={styles.productContainer}>
        <div className={`d-flex flex-wrap ${styles.products}`}>
          {filteredProducts.map(product => <ProductSummary key={product.id} product={product}/>)}
        </div>
      </div>
    </div>
  );
};

export default Home;
