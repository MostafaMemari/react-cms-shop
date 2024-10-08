import ProductRow from "./ProductRow";

function ProductTable({ products }) {
  return (
    <table className="table table-report -mt-2">
      <thead>
        <tr>
          <th className="whitespace-nowrap">تصاویر</th>
          <th className="whitespace-nowrap">نام محصول</th>
          <th className="text-center whitespace-nowrap">تعداد</th>
          <th className="text-center whitespace-nowrap">وضعیت</th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((product) => <ProductRow key={product.id} product={product} />)
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              هیچ محصولی یافت نشد.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;
