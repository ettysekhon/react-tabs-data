import fetch from 'isomorphic-fetch';
import {
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  REMOVE_PRODUCT,
  AMEND_PRODUCT,
  TAB_CLICK
} from './types';

const URL = 'http://localhost:3000/api';

// nothing to do here but can be used for loading flag etc.
const requestProducts = () => {
  return {
    type: REQUEST_PRODUCTS
  };
};

const receiveProducts = (json) => {
  const products = json.data.products;
  return {
    type: RECEIVE_PRODUCTS,
    products
  };
};

export const removeProduct = (tPND) => {
  return {
    type: REMOVE_PRODUCT,
    tPND
  };
};

export const amendProduct = (qsNo) => {
  return {
    type: AMEND_PRODUCT,
    qsNo
  };
};

export const tabClick = (tab) => {
  return {
    type: TAB_CLICK,
    tab
  };
};

export const fetchProducts = () => {
  return (dispatch) => {
    dispatch(requestProducts());
    return fetch(`${URL}/products`)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveProducts(json));
      });
  };
};
