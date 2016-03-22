import React, { PropTypes } from 'react';
import styles from '../index.css';
import {
  AMEND_COLUMN_HEADERS,
  AMEND_NEW_COLUMN_HEADERS,
  CURRENT_GROUP_HEADER,
  NEW_GROUP_HEADER,
  TPND } from '../utils/constants';

class AmendTable extends React.Component {
  renderColumnGroups() {
    console.log('AMEND_COLUMN_HEADERS', AMEND_COLUMN_HEADERS.length);
    const currentColSpan = AMEND_COLUMN_HEADERS.length;
    const newColSpan = AMEND_NEW_COLUMN_HEADERS.length + 1;
    const groups = [
      { text: CURRENT_GROUP_HEADER, colSpan: currentColSpan },
      { text: NEW_GROUP_HEADER, colSpan: newColSpan }];
    return groups.map((group, i) => {
      return (
        <th
          colSpan={group.colSpan}
          key={i}
        >{group.text}</th>
      );
    });
  }
  renderColumns() {
    const headers = AMEND_COLUMN_HEADERS
    .concat(AMEND_NEW_COLUMN_HEADERS)
    .concat(['']);
    return headers.map((header, i) => <th key={i}>{header}</th>);
  }
  renderRows() {
    const products = this.props.products;
    const headers = AMEND_COLUMN_HEADERS
    .concat(AMEND_NEW_COLUMN_HEADERS)
    .concat(['']);

    return products.map((product, j) => {
      const row = headers.map((header, i) => {
        const currentHeader = AMEND_COLUMN_HEADERS.indexOf(header) > -1;
        const newHeader = AMEND_NEW_COLUMN_HEADERS.indexOf(header) > -1;
        const clickHandler = () => { this.props.onRemove(product[TPND]); };
        let cell;
        if (currentHeader) {
          cell = (<td key={i}>{product[header]}</td>);
        } else if (newHeader) {
          cell = (
            <td key={i}>
              <input
                className={styles.input}
                type={'text'}
              ></input></td>);
        } else {
          cell = (<td key={i}><button onClick={clickHandler}>Remove</button></td>);
        }
        return cell;
      });

      return (<tr key={j}>{row}</tr>);
    });
  }
  render() {
    const columnGroups = this.renderColumnGroups();
    const columns = this.renderColumns();
    const rows = this.renderRows();
    return (
      <table className={styles.table}>
        <thead>
          <tr>{columnGroups}</tr>
          <tr>{columns}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

AmendTable.propTypes = {
  onRemove: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default AmendTable;
