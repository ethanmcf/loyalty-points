import { useNavigate, useParams } from "react-router-dom";
import { getPromotionById, updatePromotion } from "../../apis/promotionsApis";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React, { useState, useEffect, use } from "react";
import TextField from "@mui/material/TextField";
import "../../styles/detailsPage.css";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeletePromotionsDialog } from "../../components/delete-dialogs/DeletePromotionsDialog";
import { getTransaction } from "../../apis/transactionsApi";
import { useUser } from "../../contexts/UserContext";

/**
 * The Transactions Details page, which displays more information about the transactions
 * Visible to ??
 */
export function TransactionDetails() {
    const { user } = useUser();
    const { transactionId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState();
    const [transaction, setTransaction] = useState();
    const [oldTransaction, setOldTransaction] = useState();
    const navigate = useNavigate();

    const handleSetToEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };

    const fetchData = async () => {
        try {
            const res = await getTransaction(localStorage.token, Number(transactionId));
            setTransaction(res);
            setOldTransaction(res);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div id="details-page">
            <div className="header">
                <div className="title">
                    <IconButton onClick={() => navigate("/dashboard")}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h2>Transactions Details Page</h2>
                </div>
                {/* TODO: Dialog for deleting transactions */}
            </div>
            {!error ? null : <Alert severity="error">{error}</Alert>}
            {transaction && (
                <>
                    <div className="general-header">
                        <h3>General Data</h3>
                        {isEditing ? (
                            <Button type="submit" form="info-form">
                                Save
                            </Button>
                        ) : (
                             (user.role === 'manager' || user.role === 'superuser') && (
                            <Button type="button" form="" onClick={handleSetToEdit}>
                                Edit
                            </Button>
                            )
                        )}
                    </div>
                    <form id="info-form">
                        <TextField
                            id="name"
                            name="name"
                            label="Transaction name"
                            value={transaction.name}
                            onChange={(e) =>
                                setTransaction({ ...transaction, name:e.target.value})
                            }
                            required
                            disabled={true}
                        />
                        <TextField
                            id="userId"
                            name="userId"
                            label="utorId"
                            value={transaction.utorid}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="type"
                            name="type"
                            label="Type of Transaction"
                            value={transaction.type}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="spent"
                            name="spent"
                            label="Amount Spent"
                            value={transaction.spent}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="amount"
                            name="amount"
                            label="Amount"
                            value={transaction.amount}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="promotionIds"
                            name="promotionIds"
                            label="Related Promotion Ids"
                            value={transaction.promotionIds}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="suspicious"
                            name="suspicious"
                            label="Suspicious?"
                            value={transaction.suspicious}
                            required
                            disabled={!isEditing}
                        >
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                        </TextField>
                        <TextField
                            id="remark"
                            name="remark"
                            label="Remarks"
                            value={transaction.remark}
                            required
                            disabled={true}
                        />
                        <TextField
                            id="createdBy"
                            name="createdBy"
                            label="Created By"
                            value={transaction.createdBy}
                            required
                            disabled={true}
                        />
                    </form>
                </>
            )}
        </div>
    );
}