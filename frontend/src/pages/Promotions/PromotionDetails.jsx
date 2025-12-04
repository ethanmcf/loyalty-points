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
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "../../styles/detailsPage.css";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeletePromotionsDialog } from "../../components/delete-dialogs/DeletePromotionsDialog";

export function PromotionDetails() {
  const { promotionId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState();
  const [promotionData, setPromotionData] = useState();
  const [oldPromotionData, setOldPromotionData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getPromotionById(
        localStorage.token,
        Number(promotionId)
      );
      setPromotionData(res);
      setOldPromotionData(res);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetToEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // time
    const isoStartTime = dayjs(
      formJson.startTime,
      "MM/DD/YYYY hh:mm A"
    ).toISOString();
    const isoEndTime = dayjs(
      formJson.endTime,
      "MM/DD/YYYY hh:mm A"
    ).toISOString();

    const oldStartTime = new Date(oldPromotionData.startTime);
    const newStartTime = new Date(isoStartTime);
    const oldEndTime = new Date(oldPromotionData.endTime);
    const newEndTime = new Date(isoEndTime);

    // api call
    try {
      const reqBody = {
        name: formJson.name === oldPromotionData.name ? null : formJson.name,
        description: formJson.description,
        type: formJson.type,
        startTime:
          oldStartTime.toISOString() === newStartTime.toISOString()
            ? null
            : isoStartTime,
        endTime:
          oldEndTime.toISOString() === newEndTime.toISOString()
            ? null
            : isoEndTime,
        minSpending:
          Number(formJson.minSpending) === Number(oldPromotionData.minSpending)
            ? null
            : Number(formJson.minSpending),
        rate:
          Number(formJson.rate) === Number(oldPromotionData.rate)
            ? null
            : Number(formJson.rate),

        points:
          Number(formJson.points) === Number(oldPromotionData.points)
            ? null
            : Number(formJson.points),
      };
      const res = await updatePromotion(
        localStorage.token,
        promotionId,
        reqBody
      );
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };
  /* Reference: 
  https://reactrouter.com/api/hooks/useNavigate 
  https://www.w3schools.com/js/js_window_history.asp*/
  const returnToPreviousPage = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div id="promotions-details-page" className="details-page">
      <div className="header">
        <div className="title">
          <IconButton onClick={returnToPreviousPage}>
            <ArrowBackIcon />
          </IconButton>
          <h2>Promotion Details Page</h2>
        </div>
        <DeletePromotionsDialog id={promotionId} />
      </div>
      {!error ? null : <Alert severity="error">{error}</Alert>}
      {promotionData && (
        <>
          <div className="general-header">
            <h3>General Data</h3>
            {isEditing ? (
              <Button type="submit" form="promotion-info-form">
                Save
              </Button>
            ) : (
              <Button type="button" form="" onClick={handleSetToEdit}>
                Edit
              </Button>
            )}
          </div>
          <form
            id="promotion-info-form"
            onSubmit={handleSubmit}
            className="info-form"
          >
            <TextField
              id="name"
              name="name"
              label="Promotion Name"
              value={promotionData.name}
              onChange={(e) =>
                setPromotionData({ ...promotionData, name: e.target.value })
              }
              required
              disabled={!isEditing}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              value={promotionData.description}
              onChange={(e) =>
                setPromotionData({
                  ...promotionData,
                  description: e.target.value,
                })
              }
              required
              disabled={!isEditing}
            />
            <FormControl fullWidth>
              <InputLabel id="type">Promotion Type</InputLabel>
              <Select
                name="type"
                id="type"
                value={promotionData.type}
                disabled={!isEditing}
                label="Promotion Type"
                onChange={(e) =>
                  setPromotionData({ ...promotionData, type: e.target.value })
                }
              >
                <MenuItem value={"automatic"}>Automatic</MenuItem>
                <MenuItem value={"onetime"}>One-time</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  disabled={!isEditing}
                  name="startTime"
                  label="Start Time"
                  value={dayjs(promotionData.startTime)}
                  onChange={(e) =>
                    setPromotionData({
                      ...promotionData,
                      startTime: dayjs(e),
                    })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  disabled={!isEditing}
                  name="endTime"
                  label="End Time"
                  value={dayjs(promotionData.endTime)}
                  onChange={(e) =>
                    setPromotionData({
                      ...promotionData,
                      endTime: dayjs(e),
                    })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              id="minSpending"
              name="minSpending"
              label="Minimum Spending Requirement"
              value={promotionData.minSpending}
              onChange={(e) =>
                setPromotionData({
                  ...promotionData,
                  minSpending: e.target.value,
                })
              }
              required
              disabled={!isEditing}
            />
            <TextField
              id="rate"
              name="rate"
              label="Promotional Rate"
              value={promotionData.rate}
              onChange={(e) =>
                setPromotionData({ ...promotionData, rate: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              id="points"
              name="points"
              label="Promotional Points"
              value={promotionData.points}
              onChange={(e) =>
                setPromotionData({ ...promotionData, points: e.target.value })
              }
              disabled={!isEditing}
            />
          </form>
        </>
      )}
    </div>
  );
}
