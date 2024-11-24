import _ from "lodash";
import { useEffect, useState } from "react";
import Table from "../../base-components/Table";
import { useFetchData } from "../../hooks/useFetchData";
import { getReportPurchaseProductsService } from "../../services/Axios/Request/products";
import { Toast } from "../../base-components/Toast";
import Pagination from "../../components/Pagination/Pagination";
import SearchInput from "../../base-components/SearchInput";
import DataSummary from "../../base-components/DataSummary/DataSummary";

import LoadingIcon from "../../base-components/LoadingIcon";
import ProductCard from "./components/ProductCard";
import { TransactionType } from "../../features/transaction/types/enym";
import TomSelect from "../../base-components/TomSelect";
import { FormInput } from "../../base-components/Form";
import TomSelectCategory from "../../components/TomSelect";
import TomSelectColor from "../../components/TomSelect";
import TomSelectSeller from "../../components/TomSelect";
import { getCategoriesService } from "../../services/Axios/Request/categories";
import { getColorsService } from "../../services/Axios/Request/colors";
import { getSellersService } from "../../services/Axios/Request/sellers";
import useOptionsData from "../../hooks/useOptionsData";
import usePagination from "../../hooks/usePagination";

interface MainProps {
  transactionType: TransactionType;
}

type Filters = {
  categoryId?: string;
  colorId?: string;
  sellerId?: string;
};

const Main: React.FC<MainProps> = ({ transactionType }) => {
  const { page, limit, search, updatePage, updateLimit, updateSearch } = usePagination();

  const [select, setSelect] = useState("1");

  const [filters, setFilters] = useState<Filters>({});

  const { data, loading, error, refetch } = useFetchData(getReportPurchaseProductsService, [page, limit, search]);

  const { options: categoryOptions, loading: loadingCategory } = useOptionsData(getCategoriesService);
  const { options: colorOptions, loading: loadingColor } = useOptionsData(getColorsService);
  const { options: sellerOptions, loading: loadingSeller } = useOptionsData(getSellersService);

  const handleFilterUpdate = (filterKey: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
    refetch([page, limit, search, { ...filters, [filterKey]: value }]);
  };

  useEffect(() => {
    if (!loading && !data?.data.products) {
      Toast("دریافت اطلاعات با خطا مواجه شد", "error");
    }
  }, [loading, data]);

  const handlePageChange = (newPage: number) => {
    updatePage(newPage);
    refetch([newPage, limit, search, filters]);
  };
  const handleLimitChange = (newLimit: number) => {
    updateLimit(newLimit);
    refetch([page, newLimit, search, filters]);
  };
  const handleSearch = (searchValue: string) => {
    updateSearch(searchValue);
    refetch([page, limit, searchValue, filters]);
  };

  const handleProductSubmission = () => {
    refetch();
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, data?.data.pagination.totalCount || 0);
  const total = data?.data.pagination.totalCount || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
          <h2 className="text-lg font-medium intro-y">
            {transactionType === TransactionType.PURCHASE ? "خرید" : "فروش"} محصول
          </h2>

          {(!loading && data?.data.products && <DataSummary start={start} end={end} total={total} />) || (
            <div className="hidden mx-auto md:block text-slate-500"></div>
          )}

          <SearchInput searchType="enter" onSearch={handleSearch} />
        </div>
        <div className="flex flex-col sm:flex-row items-center col-span-12 justify-between gap-3 intro-y sm:flex-nowrap">
          <TomSelectColor
            loading={loadingColor}
            value={filters.colorId || "0"}
            onChange={(value) => handleFilterUpdate("colorId", value)}
            options={colorOptions}
            placeholder="انتخاب رنگ"
          />

          <TomSelectCategory
            loading={loadingCategory}
            value={filters.categoryId || "0"}
            onChange={(value) => handleFilterUpdate("categoryId", value)}
            options={categoryOptions}
            placeholder="انتخاب دسته‌بندی"
          />

          <TomSelectSeller
            loading={loadingSeller}
            value={filters.sellerId || "0"}
            onChange={(value) => handleFilterUpdate("sellerId", value)}
            options={sellerOptions}
            placeholder="انتخاب فروشنده"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center col-span-12 justify-between gap-3 intro-y sm:flex-nowrap">
          <FormInput className="" id={`regular-form`} type="number" placeholder="موجودی کمتر از" />
          <FormInput
            className=""
            id={`regular-form`}
            type="number"
            placeholder="موجودی بیشتر
           از"
          />
          <FormInput className="" id={`regular-form`} type="number" placeholder="فروش بیشتر از" />
          <TomSelect
            value={select}
            onChange={setSelect}
            options={{
              placeholder: "Select your favorite categorys",
            }}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="1">صعودی</option>
            <option value="2">نزولی</option>
          </TomSelect>
          <TomSelect
            value={select}
            onChange={setSelect}
            options={{
              placeholder: "Select your favorite categorys",
            }}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="1">صعودی</option>
            <option value="2">نزولی</option>
          </TomSelect>
        </div>

        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2 text-start">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center">
                  <LoadingIcon icon="puff" className="w-12 h-12" />
                  <div className="mt-2 text-sm text-center text-gray-500">در حال بارگذاری...</div>
                </div>
              </div>
            ) : data?.data.products ? (
              <ProductCard
                onSuccess={handleProductSubmission}
                products={data?.data.products}
                transactionType={transactionType}
              />
            ) : (
              <h2 className="text-center">هیچ محصولی یافت نشد</h2>
            )}
          </Table>
        </div>

        {loading ? null : data?.data.pagination ? (
          <Pagination
            page={page}
            limit={limit}
            pageCount={data?.data.pagination.pageCount}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        ) : null}
      </div>
    </>
  );
};

export default Main;