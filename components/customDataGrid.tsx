import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const CustomDataGrid = ({ rows, columns }: DataGridProps) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pagination
      pageSizeOptions={[5, 10, 20]}
      sx={{
        "& .MuiDataGrid-root": {
          backgroundColor: isDark ? "#1D1D1D" : "#fff",
          color: isDark ? "#fff" : "#000",
        },
        // Celda de cada fila
        "& .MuiDataGrid-cell": {
          borderBottom: `1px solid ${isDark ? "#09f" : "#ccc"}`,
          backgroundColor: isDark ? "#1D1D1D" : "#fff",

          color: isDark ? "#000" : "#000",
          "&:hover": {
            backroundColor: isDark ? "#fff" : "#f5f5f5", // Color de fondo al pasar el mouse
          },
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: isDark ? "#333" : "#F5F5F5",
          color: isDark ? "#fff" : "#000",
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: isDark ? "#333" : "#F5F5F5",
          color: isDark ? "#fff" : "#000",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: isDark ? "#444" : "#e0e0e0", // Color de fondo de fila al pasar el mouse
        },
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
    />
  );
};

export default CustomDataGrid;
