import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useState, useEffect } from "react";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be
// negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  ...props
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          disabled={orderedQuantity >= availableCount}
          className={styles.actionButton}
          onClick={() => props.addProduct(id)}
        >
          +
        </button>
        <button
          disabled={orderedQuantity === 0}
          className={styles.actionButton}
          onClick={() => props.removeProduct(id)}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  //get the data
  useEffect(() => {
    getProducts().then((response) => setProducts(response));
  }, []);

  const removeProduct = (id) => {
    let product = products.find((x) => x.id === id);
    if (product.orderedQuantity === undefined) product.orderedQuantity = 0;

    if (product.orderedQuantity < 0) return;
    product.orderedQuantity = product.orderedQuantity - 1;
    if (product.orderedQuantity >= 0)
      product.total = (product.price * product.orderedQuantity).toFixed(2);

    setProducts((products) => [...products]);
    getTotal();
  };

  const addProduct = (id) => {
    let product = products.find((x) => x.id === id);
    if (product.orderedQuantity === undefined) product.orderedQuantity = 0;
    product.orderedQuantity = product.orderedQuantity + 1;
    product.total = (product.price * product.orderedQuantity).toFixed(2);

    setProducts((products) => [...products]);

    getTotal();
  };
  const getTotal = () => {
    let subtotal = products.reduce(
      (total = 0, item) =>
        item.price * (item.orderedQuantity ? item.orderedQuantity : 0) + total,
      0
    );

    if (subtotal > 1000) {
      setDiscount(subtotal * 0.1);
      setTotal(subtotal * 0.9);
    } else {
      setDiscount(0);
      setTotal(subtotal);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {!products.length && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Products should be rendered here */}
            {products.map((p) => (
              <Product
                addProduct={addProduct}
                removeProduct={removeProduct}
                key={p.id}
                id={p.id}
                name={p.name}
                availableCount={p.availableCount}
                price={p.price}
                orderedQuantity={p.orderedQuantity ? p.orderedQuantity : 0}
                total={p.total ? p.total : "0.00"}
              />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        {discount > 0 && <p>{`Discount: $ ${discount.toFixed(2)}`} </p>}
        <p>Total: ${total > 0 ? total.toFixed(2) : "0.00"}</p>
      </main>
    </div>
  );
};

export default Checkout;
