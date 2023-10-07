import React from "react";
import Carousel from "../components/navigation/Carousel";
import ProductsSlick from "../components/products/ProductsSlick";
import { slides } from "../data/carouselData.json";

function Home() {
  return (
    <main>
      <Carousel data={slides} />

      <section className="p-14 flex flex-col gap-10">
        <article className="bg-white p-5 flex flex-col gap-8 shadow-md">
          <h3 className="font-semibold text-xl">Tendencias</h3>
          <ProductsSlick query="trending=Slick" limit={15} />
        </article>
        <article className="bg-white p-5 flex flex-col gap-8 shadow-md">
          <h3 className="font-semibold text-xl">Descuentos</h3>
          <ProductsSlick query="discount=Slick" limit={15} />
        </article>
        <article className="bg-white p-5 flex flex-col gap-8 shadow-md">
          <h3 className="font-semibold text-xl">Más Vendidos</h3>
          <ProductsSlick query="sold=Slick" limit={15} />
        </article>
      </section>
    </main>
  );
}

export default Home;
