import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_BOY_PRODUCTS, selectBoyProducts } from '../../redux-toolkit/slice/productSlice';


const BoyShoes = () => {
  return (
    <>
      <PageProducts
        currentName='Nam'
        fieldValue='giay-nam'
        STORE_NAME_PRODUCTS={STORE_BOY_PRODUCTS}
        selectNameProduct={selectBoyProducts}
      />
    </>
  );
};

export default BoyShoes;