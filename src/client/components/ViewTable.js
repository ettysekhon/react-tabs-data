import React, { PropTypes } from 'react';
import styles from '../index.css';
import { VIEW_COLUMN_HEADERS, AMEND_HEADER, QS_NO } from '../utils/constants';

class ViewTable extends React.Component {
  renderRows() {
    const products = this.props.products;
    return products.map((product, j) => {
      let rowClass;
      const row = VIEW_COLUMN_HEADERS.map((header, i) => {
        const clickHandler = () => { this.props.onAmend(product[QS_NO]); };
        return header !== AMEND_HEADER
          ? (<td key={i}>{product[header]}</td>)
          : (<td key={i}>
            <input
              checked={product[header]}
              disabled={!product[AMEND_HEADER] && this.props.canAmend}
              onChange={clickHandler}
              type={'checkbox'}
            /></td>);
      });

      if (product[AMEND_HEADER]) {
        rowClass = styles.active;
      } else {
        if (this.props.canAmend) {
          rowClass = styles.inactive;
        }
      }

      return (
        <tr
          className={rowClass}
          key={j}
        >{row}</tr>);
    });
  }
  renderColumns() {
    return VIEW_COLUMN_HEADERS.map((header, i) => <th key={i}>{header}</th>);
  }
  render() {
    const columns = this.renderColumns();
    const rows = this.renderRows();
    return (
      <table className={styles.table}>
        <thead>
          <tr>{columns}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

ViewTable.propTypes = {
  canAmend: PropTypes.bool,
  onAmend: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ViewTable;
