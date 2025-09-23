import React, { useState } from "react";
import { Box,Card,CardContent,Typography,Button,Modal,IconButton,Grid,TextField, colors } from "@mui/material";

const DraftPlanIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AutoDraft = () => {
    const [modalOpen,setModalOpen] = useState(false);
    const [status,setStatus] = useState("Pending");

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleApprove = () => {
        setStatus("Approved!");
        handleCloseModal();
    };

    const handleReject = () => {
        setStatus("Rejected");
        handleCloseModal();
    };

    const statusStyles = () => {
        switch(status) {
            case "Approved!":
                return {
                    backgroundColor: "#4caf50",
                    color: 'white',
                    border: '2px solid #8dce8fff',
                };
            case "Rejected":
                return {
                    backgroundColor: '#f44336',
                    color: 'black',
                    border: '2px solid #f3736aff',
                };
            case "Pending":
            default:
                return {
                    backgroundColor: 'transparent',
                    color: '#fdc51fff',
                    border: '2px solid #f3d26eff',
                };
        }
    };

    return (
        <>
            <Card sx={{
                backgroundColor: "#1a1d23",
                color: "whitesmoke",
                borderRadius: 3,
                boxShadow: 3,
                padding: 2,
                border: '1px solid #f6a33dff',
                boxShadow: 3,
                width:'550px',
                margin:'auto',
                marginTop:2,
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <DraftPlanIcon />
                        <Box sx={{ ml: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Auto Draft Plan
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                            Generated 23/09/2025 • 10 assignments
                        </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ ...statusStyles(), borderRadius: 2, px: 2, py: 0.5, fontWeight: 'bold' }}>
                        {status}
                    </Box>
                </Box>
                <Grid container spacing={4} sx={{ mt: 2, textAlign: "center" }}>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Punctuality
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
                        87%
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Branding
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                        92%
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Maintenance
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#cddc39" }}>
                        76%
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{mt:3}}>
                    <Typography variant="body2" sx={{fontWeight:'bold',color:'#ffc107'}}>
                        Risk Flags:
                    </Typography>
                    <ul style={{color:'whitesmoke',listStyleType:'disc',paddingLeft:'20px'}}>
                        <li>3 trains require telcom clearance</li>
                        <li>Route 2 has maintenance overlap</li>
                    </ul>
                </Box>

                <Box sx={{mt:3, textAlign:'center'}}>
                    {status === 'Pending' ? (
                        <Button variant="container" sx={{
                            backgroundColor: "#404455",
                            color: "whitesmoke",
                            borderRadius: 2,
                            px: 3,
                            "&:hover": { backgroundColor: "#505465" },
                            }} onClick={handleOpenModal}>
                                Preview
                        </Button>
                    ) : (
                        <Button variant="contained" sx={{
                            backgroundColor: "#404455",
                            color: "whitesmoke",
                            borderRadius: 2,
                            px: 3,
                            "&:hover": { backgroundColor: "#505465" },
                            }} onClick={handleOpenModal}>
                                Preview
                        </Button>
                    )}
                </Box>
            </Card>

            {/*modal*/}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "#2a2f39",
                    color: "whitesmoke",
                    borderRadius: 3,
                    boxShadow: 24,
                    border: '1px solid #f6a33dff',
                    p: 4,
                }}
                >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Draft Plan Preview
                    </Typography>
                    <IconButton onClick={handleCloseModal} sx={{ color: "whitesmoke" }}>
                    <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: "#a0a0a0", mb: 2 }}>
                    Review the auto-generated plan before approval
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2, textAlign: "center" }}>
                    <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Punctuality
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
                        87%
                    </Typography>
                    </Grid>
                    <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Branding
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                        92%
                    </Typography>
                    </Grid>
                    <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ color: "#a0a0a0" }}>
                        Maintenance
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#cddc39" }}>
                        76%
                    </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Assignments (10)
                    </Typography>
                    <Box
                    sx={{
                        mt: 1,
                        bgcolor: "#1c2128",
                        borderRadius: 2,
                        p: 2,
                        maxHeight: "200px",
                        overflowY: "auto",
                    }}
                    >
                    {[
                        { train: "T001", route: "Route 3", confidence: 84 },
                        { train: "T002", route: "Route 4", confidence: 68 },
                        { train: "T003", route: "Route 2", confidence: 65 },
                        { train: "T004", route: "Route 4", confidence: 68 },
                        { train: "T005", route: "Route 4", confidence: 60 },
                        { train: "T006", route: "Route 4", confidence: 83 },
                    ].map((assignment, index) => (
                        <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 0.5,
                            borderBottom: "1px solid #404455",
                            "&:last-child": { borderBottom: "none" },
                        }}
                        >
                        <Typography variant="body2" sx={{ color: "whitesmoke" }}>
                            {assignment.train} → {assignment.route}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                            {assignment.confidence}% confidence
                        </Typography>
                        </Box>
                    ))}
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#ffc107" }}>
                    Risk Assessment
                    </Typography>
                    <ul style={{ color: "whitesmoke", listStyleType: "disc", paddingLeft: "20px" }}>
                    <li>3 trains require telecom clearance</li>
                    <li>Route 2 has maintenance overlap</li>
                    </ul>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Comments (optional)
                    </Typography>
                    <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Add any comments or notes..."
                    sx={{
                        mt: 1,
                        "& .MuiInputBase-root": {
                        backgroundColor: "#1c2128",
                        color: "whitesmoke",
                        borderRadius: 2,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                        },
                        "& .MuiInputBase-input::placeholder": {
                        color: "#a0a0a0",
                        opacity: 1,
                        },
                    }}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                    <Button
                    variant="outlined"
                    sx={{
                        borderColor: "#a0a0a0",
                        color: "#a0a0a0",
                        borderRadius: 2,
                        "&:hover": { borderColor: "#fff", color: "#fff" },
                    }}
                    onClick={handleCloseModal}
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#f44336",
                        color: "whitesmoke",
                        borderRadius: 2,
                        px: 3,
                        "&:hover": { backgroundColor: "#d32f2f" },
                    }}
                    onClick={handleReject}
                    >
                    Reject
                    </Button>
                    <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#4caf50",
                        color: "whitesmoke",
                        borderRadius: 2,
                        px: 3,
                        "&:hover": { backgroundColor: "#388e3c" },
                    }}
                    onClick={handleApprove}
                    >
                    Approve Plan
                    </Button>
                </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AutoDraft;