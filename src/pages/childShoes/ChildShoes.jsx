import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_CHILD_PRODUCTS, selectChildProducts } from '../../redux-toolkit/slice/productSlice';


const ChildShoes = () => {
  return (
    <>
      <PageProducts
        currentName='Trẻ em'
        fieldValue='giay-tre-em'
        STORE_NAME_PRODUCTS={STORE_CHILD_PRODUCTS}
        selectNameProduct={selectChildProducts} />
    </>
  );
};

export default ChildShoes;