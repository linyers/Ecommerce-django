import { useState, useEffect } from "react";
import PaymentPage from "./PaymentPage";
import ShippingPage from "./ShippingPage";

export default function BuyingPage() {
  const [body, setBody] = useState({});

  useEffect(() => {
    localStorage.setItem('orderBody', JSON.stringify(body));
  }, [body])

  return (
    <>
      {Object.keys(body).length > 0 ? (
        <PaymentPage setBody={setBody} />
      ) : (
        <ShippingPage setBody={setBody} body={body} />
      )}
    </>
  );
}
