import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ViewTable from '../components/ViewTable';
import AmendTable from '../components/AmendTable';
import { TAB_VIEW, TAB_AMEND } from '../utils/constants';
import { fetchProducts, tabClick, amendProduct, removeProduct } from '../actions';
import styles from '../index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onTabClick = this.onTabClick.bind(this);
    this.onAmend = this.onAmend.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
  }
  componentDidMount() {
    this.props.fetchProducts();
  }
  onRemove(tPND) {
    this.props.removeProduct(tPND);
  }
  onAmend(qsNo) {
    this.props.amendProduct(qsNo);
  }
  onTabClick(tab) {
    this.props.tabClick(tab);
  }
  renderTabs() {
    return this.props.tabs.map((tab, i) => {
      const onClick = () => this.onTabClick(tab.text);
      const tabActiveClass = tab.active ? styles.tabActive : styles.tab;
      const tabClass = (tab.text === TAB_AMEND && !this.props.canAmend)
        ? styles.tabDisabled
        : tabActiveClass;
      return (
        <li
          className={tabClass}
          key={i}
          onClick={onClick}
        >{tab.text}</li>);
    });
  }
  render() {
    let content;
    const activeTab = this.props.tabs.filter((t) => t.active)[0];
    const viewTable = (
      <ViewTable
        canAmend={this.props.canAmend}
        onAmend={this.onAmend}
        products={this.props.products}
      />);
    const amendTable = (
      <AmendTable
        onRemove={this.onRemove}
        products={this.props.productsToAmend}
      />);
    // content rendered on simple condition should use dedicated tabs component
    if (this.props.products.length > 0) {
      content = activeTab.text === TAB_VIEW ? viewTable : amendTable;
    } else {
      content = 'No product data to display';
    }
    return (
      <div>
        <header className={styles.header}>
          <div className={styles.logo}>
            BRAND - Product Costs
          </div>
          <ul className={styles.tabs}>
            {this.renderTabs()}
          </ul>
          <div className={styles.headerContent}></div>
        </header>
        {content}
      </div>
    );
  }
}

App.propTypes = {
  amendProduct: PropTypes.func.isRequired,
  canAmend: PropTypes.bool.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  productsToAmend: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeProduct: PropTypes.func.isRequired,
  tabClick: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = (state) => {
  const { app } = state;
  const {
    products,
    productsToAmend,
    tabs,
    canAmend
  } = app || {
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
  };

  return {
    products,
    productsToAmend,
    tabs,
    canAmend
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeProduct: (tPND) => {
      dispatch(removeProduct(tPND));
    },
    amendProduct: (qsNo) => {
      dispatch(amendProduct(qsNo));
    },
    tabClick: (tab) => {
      dispatch(tabClick(tab));
    },
    fetchProducts: () => {
      dispatch(fetchProducts());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
