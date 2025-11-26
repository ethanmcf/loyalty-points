import { useParams } from "react-router-dom";
import { getPromotionById } from "../../apis/promotionsApis";
import { useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export function Promotion() {
  const { promotionalId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [promotionData, setPromotionData] = useState({
    id: 3,
    name: "Start of Summer Celebration",
    description: "A simple promotion",
    type: "automatic",
    endTime: "2025-11-10T17:00:00Z",
    minSpending: 50,
    rate: 0.01,
    points: 0,
  });

  const fetchData = async () => {
    try {
      const res = await getPromotionById(localStorage.token, promotionalId);
    } catch (error) {
      console.error("error");
    }
  };

  useEffect(() => {
    fetchData();
  });
  return (
    <div>
      <h2>Promotion Details Page</h2>
      <form id="promotion-info-form">
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
            setPromotionData({ ...promotionData, description: e.target.value })
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
            setPromotionData({ ...promotionData, minSpending: e.target.value })
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
          required
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
          required
          disabled={!isEditing}
        />
      </form>
    </div>
  );
}
