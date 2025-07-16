"use client";

import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CardHeader, Typography, Button, Grid, TextField, Modal } from "@mui/material";
import withPermission from "@/app/withPermission";
import axios from "axios";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { CheckCircle } from "@mui/icons-material";
import Cookies from "js-cookie";

function DiscountsClient() {
    const token = Cookies.get("access_token");

    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState({
        zoneId: 0,
        usuario: "",
        cantidad_descuentos: 0,
        descuentos_usados: 0,
        id: "",
        nombre_zona: "",
        nombre_completo: "",
    });
    const [crearModal, setCrearModal] = useState(false);
    const [editarModal, setEditarModal] = useState(false);
    const [okModal, setOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const getData = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/zone`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const columns = [
        { field: "nombre_zona", headerName: "Consultorio", flex: 1 },
        { field: "usuario", headerName: "Usuario", flex: 1 },
        { field: "cantidad_descuentos", headerName: "Capacidad", flex: 1 },
        {
            field: "descuentos_usados",
            headerName: "Dctos. Disponibles",
            flex: 1,
            valueGetter: (params: any) =>
                params.row.cantidad_descuentos - params.row.descuentos_usados,
        },
        {
            field: "accion",
            headerName: "Acción",
            renderCell: (params: any) => (
                <Button
                    onClick={() => {
                        setSelectedUser(params.row);
                        setEditarModal(true);
                    }}
                    variant="outlined"
                    size="small"
                >
                    Editar
                </Button>
            ),
        },
    ];

    const handleUpdate = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/editInfoDiscounts/${selectedUser.zoneId}`,
                {
                    quantityDiscounts: selectedUser.cantidad_descuentos,
                    user: selectedUser.usuario,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setModalMessage("Datos actualizados correctamente");
            setOkModal(true);
            getData();
            setEditarModal(false);
        } catch (err) {
            console.error(err);
            setModalMessage("No se pudieron actualizar los datos");
            setOkModal(true);
        }
    };

    return (
        <Box p={3}>
            <Card>
                <CardHeader title="Administración de Descuentos" />
                <CardContent>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button variant="contained" color="warning" onClick={() => setCrearModal(true)}>
                            Agregar Usuario
                        </Button>
                    </Box>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        getRowId={(row: any) => row.id}
                        autoHeight
                    />
                </CardContent>
            </Card>

            {/* Modal de edición */}
            <Modal open={editarModal} onClose={() => setEditarModal(false)}>
                <Box p={3} sx={{ bgcolor: "white", m: "auto", mt: 10, width: 400 }}>
                    <Typography variant="h6" gutterBottom>Editar descuentos</Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Usuario"
                        value={selectedUser.usuario}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usuario: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        margin="normal"
                        label="Cantidad de Descuentos"
                        value={selectedUser.cantidad_descuentos}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, cantidad_descuentos: parseInt(e.target.value) })
                        }
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={() => setEditarModal(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleUpdate} color="success">
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal de confirmación */}
            <Modal open={okModal} onClose={() => setOkModal(false)}>
                <Box p={3} sx={{ bgcolor: "white", m: "auto", mt: 10, width: 400, textAlign: "center" }}>
                    <CheckCircle color="success" sx={{ fontSize: 60 }} />
                    <Typography variant="h6" mt={2}>{modalMessage}</Typography>
                    <Box mt={3}>
                        <Button onClick={() => setOkModal(false)}>Aceptar</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

const DiscountsUsersClient = withPermission(DiscountsClient, 46);
export default DiscountsUsersClient;
