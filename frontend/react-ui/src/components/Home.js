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

  const [dropdownTitle, setDropdownTitle] = useState(AllCategories);

  let filteredProducts;
  if (dropdownTitle === AllCategories) {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(product => product.category === dropdownTitle);
  }

  const handleFilter = (eventKey, event) => {
    if (eventKey !== dropdownTitle) {
      setDropdownTitle(eventKey);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`d-flex justify-content-end align-items-center ${styles.filterBar}`}>
        <label>Filter by category:</label>
        <Dropdown onSelect={handleFilter}>
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
        <div className={`row g-3 ${styles.products}`}>
          {filteredProducts.map(product => <ProductSummary key={product.id} product={product}/>)}
        </div>
      </div>
    </div>
  );
};

export default Home;
