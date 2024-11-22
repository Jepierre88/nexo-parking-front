import { DataGrid, DataGridProps, GridLocaleText } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const CustomDataGrid = (props: DataGridProps) => {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
    console.log(resolvedTheme);
  }, [resolvedTheme]);

  const customLocaleText: GridLocaleText = {
    noRowsLabel: "No hay datos disponibles",
    columnMenuLabel: "Menú de columnas",
    columnMenuShowColumns: "Mostrar columnas",
    columnMenuFilter: "Filtrar",
    columnMenuHideColumn: "Ocultar columna",
    columnMenuUnsort: "Quitar orden",
    columnMenuSortAsc: "Ordenar ascendente",
    columnMenuSortDesc: "Ordenar descendente",
    toolbarColumns: "Columnas",
    toolbarFilters: "Filtros",
    toolbarDensity: "Densidad",
    toolbarExport: "Exportar",
    columnMenuManageColumns: "Administrar columnas visibles",
    filterOperatorAfter: "Operacion",
    footerTotalRows: "Total de filas:",
    footerRowSelected: (count) => `${count} fila(s) seleccionada(s)`,
    noResultsOverlayLabel: "",
    toolbarDensityLabel: "",
    toolbarDensityCompact: "",
    toolbarDensityStandard: "",
    toolbarDensityComfortable: "",
    toolbarColumnsLabel: "",
    toolbarFiltersLabel: "",
    toolbarFiltersTooltipHide: undefined,
    toolbarFiltersTooltipShow: undefined,
    toolbarFiltersTooltipActive: function (count: number): React.ReactNode {
      throw new Error("Function not implemented.");
    },
    toolbarQuickFilterPlaceholder: "",
    toolbarQuickFilterLabel: "",
    toolbarQuickFilterDeleteIconLabel: "",
    toolbarExportLabel: "",
    toolbarExportCSV: undefined,
    toolbarExportPrint: undefined,
    toolbarExportExcel: "",
    columnsManagementSearchTitle: "",
    columnsManagementNoColumns: "",
    columnsManagementShowHideAllText: "",
    columnsManagementReset: "",
    filterPanelAddFilter: undefined,
    filterPanelRemoveAll: undefined,
    filterPanelDeleteIconLabel: "",
    filterPanelLogicOperator: "",
    filterPanelOperator: undefined,
    filterPanelOperatorAnd: undefined,
    filterPanelOperatorOr: undefined,
    filterPanelColumns: undefined,
    filterPanelInputLabel: "",
    filterPanelInputPlaceholder: "",
    filterOperatorContains: "",
    filterOperatorDoesNotContain: "",
    filterOperatorEquals: "",
    filterOperatorDoesNotEqual: "",
    filterOperatorStartsWith: "",
    filterOperatorEndsWith: "",
    filterOperatorIs: "",
    filterOperatorNot: "",
    filterOperatorOnOrAfter: "",
    filterOperatorBefore: "",
    filterOperatorOnOrBefore: "",
    filterOperatorIsEmpty: "",
    filterOperatorIsNotEmpty: "",
    filterOperatorIsAnyOf: "",
    "filterOperator=": "",
    "filterOperator!=": "",
    "filterOperator>": "",
    "filterOperator>=": "",
    "filterOperator<": "",
    "filterOperator<=": "",
    headerFilterOperatorContains: "",
    headerFilterOperatorDoesNotContain: "",
    headerFilterOperatorEquals: "",
    headerFilterOperatorDoesNotEqual: "",
    headerFilterOperatorStartsWith: "",
    headerFilterOperatorEndsWith: "",
    headerFilterOperatorIs: "",
    headerFilterOperatorNot: "",
    headerFilterOperatorAfter: "",
    headerFilterOperatorOnOrAfter: "",
    headerFilterOperatorBefore: "",
    headerFilterOperatorOnOrBefore: "",
    headerFilterOperatorIsEmpty: "",
    headerFilterOperatorIsNotEmpty: "",
    headerFilterOperatorIsAnyOf: "",
    "headerFilterOperator=": "",
    "headerFilterOperator!=": "",
    "headerFilterOperator>": "",
    "headerFilterOperator>=": "",
    "headerFilterOperator<": "",
    "headerFilterOperator<=": "",
    filterValueAny: "",
    filterValueTrue: "",
    filterValueFalse: "",
    columnHeaderFiltersTooltipActive: function (
      count: number
    ): React.ReactNode {
      throw new Error("Function not implemented.");
    },
    columnHeaderFiltersLabel: "",
    columnHeaderSortIconLabel: "",
    footerTotalVisibleRows: function (
      visibleCount: number,
      totalCount: number
    ): React.ReactNode {
      throw new Error("Function not implemented.");
    },
    checkboxSelectionHeaderName: "",
    checkboxSelectionSelectAllRows: "",
    checkboxSelectionUnselectAllRows: "",
    checkboxSelectionSelectRow: "",
    checkboxSelectionUnselectRow: "",
    booleanCellTrueLabel: "",
    booleanCellFalseLabel: "",
    actionsCellMore: "",
    pinToLeft: "",
    pinToRight: "",
    unpin: "",
    treeDataGroupingHeaderName: "",
    treeDataExpand: "",
    treeDataCollapse: "",
    groupingColumnHeaderName: "",
    groupColumn: function (name: string): string {
      throw new Error("Function not implemented.");
    },
    unGroupColumn: function (name: string): string {
      throw new Error("Function not implemented.");
    },
    detailPanelToggle: "",
    expandDetailPanel: "",
    collapseDetailPanel: "",
    rowReorderingHeaderName: "",
    aggregationMenuItemHeader: "",
    aggregationFunctionLabelSum: "",
    aggregationFunctionLabelAvg: "",
    aggregationFunctionLabelMin: "",
    aggregationFunctionLabelMax: "",
    aggregationFunctionLabelSize: "",
    MuiTablePagination: {},
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      props.rows!.map((row) => {
        // Retirar columnas no deseadas como "id"
        const { id, ...rest } = row;

        return rest;
      })
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, "tabla-datos.xlsx");
  };

  console.log(isDark);

  return (
    <div className="w-full h-3/5">
      <Button
        className="mb-4"
        color="primary"
        variant="shadow"
        onClick={exportToExcel}
      >
        Exportar a Excel
      </Button>
      <DataGrid
        pagination
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        loading={props.loading ? props.loading : false}
        localeText={customLocaleText}
        rowHeight={50}
        rowSelection={false}
        rows={props.rows}
        sx={{
          "& .MuiDataGrid-root": {
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            color: isDark ? "#E0E0E0" : "#000000",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: isDark ? "#333333" : "#F5F5F5", // Asegura que solo uses backgroundColor
            color: isDark ? "#FFF" : "#000",
            borderBottom: `1px solid ${isDark ? "#444444" : "#CCCCCC"}`,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${isDark ? "#444444" : "#E0E0E0"}`,
            color: isDark ? "#FFFFFF" : "#000",
          },
          "& .MuiDataGrid-row": {
            alignItems: "center",
            placeItems: "center",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: isDark ? "#3A3A3A" : "#F1F1F1",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: isDark ? "#333333" : "#F5F5F5",
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiDataGrid-pagination": {
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiTablePagination-displayedRows": {
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiTablePagination-actions": {
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiDataGrid-scrollbarFiller ": {
            backgroundColor: isDark ? "#333333" : "#F5F5F5",
          },
          "& .MuiDataGrid-overlay": {
            color: isDark ? "#FFFFFF" : "#000000",
          },
          "& .MuiCircularProgress-svg": {
            color: isDark ? "#FFFFFF" : "#000000",
          },
        }}
      />
    </div>
  );
};

export default CustomDataGrid;
