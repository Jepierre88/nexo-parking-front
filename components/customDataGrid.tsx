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
  }, [resolvedTheme]);

  const customLocaleText: Partial<GridLocaleText> = {
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
    filterOperatorAfter: "Después",
    footerTotalRows: "Total de filas:",
    footerRowSelected: (count) => `${count} fila(s) seleccionada(s)`,
    filterPanelOperatorAnd: "Y",
    filterPanelOperatorOr: "O",
    filterPanelAddFilter: "Agregar filtro",
    filterPanelRemoveAll: "Quitar todos",
    filterPanelDeleteIconLabel: "Eliminar",
    filterPanelLogicOperator: "Operador lógico",
    filterPanelOperator: "Operador",
    filterPanelColumns: "Columnas",
    filterPanelInputLabel: "Valor",
    filterPanelInputPlaceholder: "Escribe un valor",
    filterOperatorContains: "Contiene",
    filterOperatorDoesNotContain: "No contiene",
    filterOperatorEquals: "Es igual a",
    filterOperatorDoesNotEqual: "No es igual a",
    filterOperatorStartsWith: "Empieza con",
    filterOperatorEndsWith: "Termina con",
    filterOperatorIsEmpty: "Está vacío",
    filterOperatorIsNotEmpty: "No está vacío",
    filterOperatorIsAnyOf: "Es alguno de",
    headerFilterOperatorContains: "Contiene",
    headerFilterOperatorDoesNotContain: "No contiene",
    headerFilterOperatorEquals: "Es igual a",
    headerFilterOperatorDoesNotEqual: "No es igual a",
    headerFilterOperatorStartsWith: "Empieza con",
    headerFilterOperatorEndsWith: "Termina con",
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      `${visibleCount} de ${totalCount}`,
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

  return (
    <div className="relative">
      <div className="flex flex-col min-h-[35rem]">
        <Button
          className="mb-4 w-40"
          size="lg"
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
              borderBottom: `1px solid ${isDark ? "#444444" : "#CCC"}`,
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
            "& .MuiDataGrid-overlayWrapperInner": {
              backgroundColor: isDark ? "#111" : "#f5f5f5",
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
    </div>
  );
};

export default CustomDataGrid;
