"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    GridLegacy as Grid,
    LinearProgress,
    CircularProgress,
    Divider,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { CONSTANTS } from "@/config/constants";
import withPermission from "@/app/withPermission";
import Cookies from "js-cookie";


function MonitoreoDeOcupacion() {
    const startDay = moment().startOf("day");
    const finalDay = moment().endOf("day");
    const effectRan = useRef(false);

    const [loading, setLoading] = useState(true);
    const [carOccupation, setCarOccupation] = useState(0);
    const [carCapacity, setCarCapacity] = useState(0);
    const [bikeOccupation, setBikeOccupation] = useState(0);
    const [bikeCapacity, setBikeCapacity] = useState(0);
    const [ingresoCar, setIngresoCar] = useState(0);
    const [salidaCar, setSalidaCar] = useState(0);
    const [ingresoMoto, setIngresoMoto] = useState(0);
    const [salidaMoto, setSalidaMoto] = useState(0);

    useEffect(() => {
        const token = Cookies.get("auth_token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        async function getData() {
            try {
                const response1 = await axios.get(`${CONSTANTS.APIURL}/zones/1`, config);
                const response2 = await axios.get(`${CONSTANTS.APIURL}/incomes/count?datetime_gte=${startDay.toISOString()}&datetime_lte=${finalDay.toISOString()}&vehicleKind=CARRO`, config);
                const response3 = await axios.get(`${CONSTANTS.APIURL}/incomes/count?datetime_gte=${startDay.toISOString()}&datetime_lte=${finalDay.toISOString()}&vehicleKind=MOTO`, config);
                const response4 = await axios.get(`${CONSTANTS.APIURL}/outcomes/count?datetime_gte=${startDay.toISOString()}&datetime_lte=${finalDay.toISOString()}&vehicleKind=CARRO`, config);
                const response5 = await axios.get(`${CONSTANTS.APIURL}/outcomes/count?datetime_gte=${startDay.toISOString()}&datetime_lte=${finalDay.toISOString()}&vehicleKind=MOTO`, config);

                setIngresoCar(response2.data || 0);
                setIngresoMoto(response3.data || 0);
                setSalidaCar(response4.data || 0);
                setSalidaMoto(response5.data || 0);
                setCarOccupation(response1.data.carOccupation || 0);
                setBikeOccupation(response1.data.bikeOccupation || 0);
                setBikeCapacity(response1.data.bikeCapacity || 0);
                setCarCapacity(response1.data.carCapacity || 0);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        }

        getData();
        const interval = setInterval(() => getData(), 30000);
        return () => clearInterval(interval);
    }, []);

    const restCar = Math.max(carCapacity - carOccupation, 0);
    const restBike = Math.max(bikeCapacity - bikeOccupation, 0);
    const resultadoCar = carCapacity > 0 ? (carOccupation / carCapacity) * 100 : 0;
    const resultadoBike = bikeCapacity > 0 ? (bikeOccupation / bikeCapacity) * 100 : 0;
    const totalCapacity = carCapacity + bikeCapacity;
    const totalOccupation = carOccupation + bikeOccupation;
    const resultadoGeneral = totalCapacity > 0 ? (totalOccupation / totalCapacity) * 100 : 0;

    const resultadoFormatoCar = resultadoCar.toFixed(0) + "%";
    const resultadoFormatoBike = resultadoBike.toFixed(0) + "%";
    const resultadoGeneralFormato = resultadoGeneral.toFixed(0) + "%";

    const tarjetas = [
        { title: "Entradas Carros", value: ingresoCar, img: "/cardIn.png" },
        { title: "Salidas Carros", value: salidaCar, img: "/cardOut.png" },
        { title: "Entradas Motos", value: ingresoMoto, img: "/motoAIn.png" },
        { title: "Salidas Motos", value: salidaMoto, img: "/motoAOut.png" },
    ];

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, minHeight: "100vh" }}>
            <Grid container justifyContent="center" spacing={4}>
                <Grid item xs={12} md={10} lg={9}>
                    <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                        <CardHeader
                            title={
                                <>
                                    <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                                        Monitoreo de Operación
                                    </Typography>
                                    <Typography variant="h6" align="center" sx={{ fontWeight: 500, mt: 1 }}>
                                        Parqueadero público
                                    </Typography>
                                </>
                            }
                            sx={{ background: "#fff", borderBottom: "1px solid #e0e0e0", pb: 2 }}
                        />
                        <CardContent sx={{ background: "#fff", pt: 4 }}>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                                    <CircularProgress size={60} thickness={5} />
                                </Box>
                            ) : (
                                <>
                                    <Grid container spacing={4} sx={{ mb: 2 }}>
                                        {[["Carros", carOccupation, carCapacity, resultadoCar], ["Motos", bikeOccupation, bikeCapacity, resultadoBike]].map(([label, occ, cap, val], i) => {
                                            const numericVal = typeof val === "number" ? val : Number(val);
                                            return (
                                                <Grid item xs={12} md={6} key={i}>
                                                    <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 3, background: "#fafbfc", boxShadow: 1 }}>
                                                        <Typography sx={{ fontWeight: 500, mb: 1 }}>
                                                            Ocupación {label}: {occ}/{cap}
                                                        </Typography>
                                                        <LinearProgress variant="determinate" value={numericVal} sx={{ height: 16, borderRadius: 8, backgroundColor: "#e0e0e0", "& .MuiLinearProgress-bar": { backgroundColor: numericVal >= 80 ? "#e74c3c" : "#2ecc40" } }} />
                                                        <Typography align="right" sx={{ mt: 1, fontWeight: 700, fontSize: 18 }}>
                                                            {numericVal.toFixed(0)}%
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>

                                    <Grid container spacing={4} sx={{ mb: 2 }}>
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ borderRadius: 2, boxShadow: 1, background: "#f8fafc", border: "1px solid #e0e0e0" }}>
                                                <CardHeader title={<Typography sx={{ fontWeight: 600 }}>Celdas disponibles:</Typography>} sx={{ pb: 0 }} />
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography align="center">Carros</Typography>
                                                            <Typography align="center" sx={{ fontWeight: 700, fontSize: 28 }}>{restCar}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography align="center">Motos</Typography>
                                                            <Typography align="center" sx={{ fontWeight: 700, fontSize: 28 }}>{restBike}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ borderRadius: 2, boxShadow: 1, background: "#f8fafc", border: "1px solid #e0e0e0" }}>
                                                <CardContent>
                                                    <Grid container alignItems="center" spacing={2}>
                                                        <Grid item xs={5}>
                                                            <Box position="relative" display="inline-flex">
                                                                <CircularProgress variant="determinate" value={resultadoGeneral} size={80} thickness={5} sx={{ color: resultadoGeneral >= 80 ? "#e74c3c" : "#2ecc40" }} />
                                                                <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
                                                                    <Typography variant="caption" sx={{ fontSize: 20, fontWeight: 700 }}>{resultadoGeneralFormato}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>Ocupación total del parqueadero</Typography>
                                                            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{resultadoGeneralFormato}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                                <Divider />
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        {tarjetas.map(({ title, value, img }, index) => (
                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card sx={{ borderRadius: 2, boxShadow: 1, background: "#fff", border: "1px solid #e0e0e0", height: 120, display: "flex", alignItems: "center", p: 2 }}>
                                                    <Box component="img" src={img} alt={title} width={48} height={48} style={{ marginRight: 16 }} />
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 400, fontSize: 16 }}>{title}</Typography>
                                                        <Typography sx={{ fontWeight: 700, fontSize: 28 }}>{value}</Typography>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default withPermission(MonitoreoDeOcupacion, 43);