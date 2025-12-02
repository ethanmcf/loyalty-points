import { useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "../../styles/detailsPage.css";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTransaction } from "../../apis/transactionsApi";
import { useUser } from "../../contexts/UserContext";
import { markTransactionSuspicious } from "../../apis/transactionsApi";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { ProcessRedemptionTransactionsDialog } from "../../components/actionDialogs/ProcessRedemptionTransactionsDialog";

/**
 * The Transactions Details page, which displays more information about the transactions
 */
export function TransactionDetails() {
    const { user } = useUser();
    const { transactionId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState();
    const [transaction, setTransaction] = useState();
    const [oldTransaction, setOldTransaction] = useState();
    const [openAddDialog, setOpenAddDialog] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const newSuspicious = formJson.suspicious === "true";

        const suspiciousChanged = transaction.suspicious !== newSuspicious;

        if (suspiciousChanged) {
            // only call the api if user has changed the value
            try {
                const res = await markTransactionSuspicious(localStorage.token, transaction.id, newSuspicious);
                setTransaction(res);
                setError(null);
                setIsEditing(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setIsEditing(false);
            }
        }
    };

    return (
        <div id="details-page">
            <div className="header">
                <div className="title">
                    {user.role === 'regular' ? (
                        <IconButton onClick={() => navigate("/dashboard")}>
                            <ArrowBackIcon />
                        </IconButton>
                ) : (
                    <IconButton onClick={() => navigate("/transactions")}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                    <h2>Transactions Details Page</h2>
                </div>
                <AddTransactionDialog isOpen={openAddDialog} setIsOpen={setOpenAddDialog} preFilledRelatedId={Number(transactionId)} />
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
                    <form id="info-form" onSubmit={handleSubmit}>
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
                            select
                            value={transaction.suspicious ? "true" : "false"}
                            required
                            disabled={!isEditing}
                            onChange={(e) =>
                                setTransaction({ ...transaction, suspicious: e.target.value })
                            }
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
                        <div className="redemption">
                        {transaction.type === 'redemption' && 
                            <p>Redeemed?</p>}
                        {transaction.type === 'redemption' && 
                            <ProcessRedemptionTransactionsDialog id={Number(transactionId)} />
                        }
                    </div>
                    </form>
                </>
            )}
        </div>
    );
}