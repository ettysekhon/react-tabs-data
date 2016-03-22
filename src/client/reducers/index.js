import { combineReducers } from 'redux';
import objectAssign from 'object-assign';
import {
  RECEIVE_PRODUCTS,
  REMOVE_PRODUCT,
  AMEND_PRODUCT,
  TAB_CLICK
} from '../actions/types';
import {
  TAB_VIEW,
  TAB_AMEND,
  AMEND_HEADER,
  QS_NO,
  TPND
} from '../utils/constants';

const getTabClickState = (state, tab) => {
  let tabs;
  if (tab !== TAB_VIEW && !state.canAmend) {
    tabs = state.tabs.map((t) => {
      t.active = t.text === TAB_VIEW;
      return t;
    });
  } else {
    tabs = state.tabs.map((t) => {
      t.active = t.text === tab;
      return t;
    });
  }
  return { tabs };
};

const getRemoveProductState = (state, tPND) => {
  // remove products to amend if TPND matches
  const productsToAmend = state.productsToAmend.filter((p) => {
    return p[TPND] !== tPND;
  });

  // remove amend flag to false on TPND match
  const products = state.products.map((p) => {
    if (p[TPND] === tPND) {
      p[AMEND_HEADER] = false;
    }
    return p;
  });

  // set can amend
  const canAmend = products.filter((p) => {
    return p[AMEND_HEADER] === true;
  }).length > 0;


  return { productsToAmend, products, canAmend };
};

const getAmendProductState = (state, qsNo) => {
  const isAmended = state.products.filter((p) => {
    if (p[QS_NO] === qsNo) {
      return p[AMEND_HEADER];
    }
    return false;
  }).length > 0;

  const products = state.products.map((p) => {
    if (p[QS_NO] === qsNo) {
      p[AMEND_HEADER] = !isAmended;
    } else {
      p[AMEND_HEADER] = false;
    }
    return p;
  });

  const amendedProducts = products.filter((p) => {
    return p[AMEND_HEADER] === true;
  });

  const canAmend = amendedProducts.length > 0;

  const uniqueTPNDs = amendedProducts.reduce((p, c) => {
    if (p.indexOf(c[TPND]) < 0) {
      p.push(c[TPND]);
    }
    return p;
  }, []);

  const productsToAmend = products.filter((p) => {
    return uniqueTPNDs.indexOf(p[TPND]) > -1;
  });

  return {
    products,
    productsToAmend: productsToAmend.map((p) => {
      const product = objectAssign({}, p);
      delete product.Amend;
      return product;
    }),
    canAmend
  };
};

const app = (state = {
  products: [],
  productsToAmend: [],
  tabs: [{
    text: TAB_VIEW,
    active: true
  }, {
    text: TAB_AMEND,
    active: false
  }],
  canAmend: false
}, action) => {
  switch (action.type) {
  case TAB_CLICK:
    return Object.assign({}, state,
      getTabClickState(state, action.tab));
  case REMOVE_PRODUCT: {
    return Object.assign({}, state,
      getRemoveProductState(state, action.tPND));
  }
  case RECEIVE_PRODUCTS: {
    return Object.assign({}, state, { products: action.products });
  }
  case AMEND_PRODUCT: {
    return Object.assign({}, state,
      getAmendProductState(state, action.qsNo));
  }
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  app
});

export default rootReducer;
