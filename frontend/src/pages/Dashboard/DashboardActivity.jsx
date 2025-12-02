import { useUser } from '../../contexts/UserContext';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

/**
 * Total Suspicious Transactions Count
 */
export function ActivityOverview({ transactions }) {
    const { user } = useUser();
    
    if (!transactions) {
        return <Typography color="textSecondary">Loading activity metrics...</Typography>;
    }

    // Total Suspicious Transactions Count
    const suspiciousFilter = transactions.filter(t => 
        t.suspicious === true 
    );

    const suspiciousCount = suspiciousFilter.length;

    const MetricCard = ({ icon, label, value, color }) => (
        <Card sx={{ minWidth: 200, flexGrow: 1, backgroundColor: color || '#f5f5f5', color: '#333' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom>{label}</Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                </Box>
                {icon}
            </CardContent>
        </Card>
    );


    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <MetricCard 
                icon={<ReportProblemIcon sx={{ fontSize: 36, color: '#dc3545' }} />}
                label="My Total Suspicious Transactions"
                value={suspiciousCount}
                color="#ffe0e6"
            />
            
        </Box>
    );
}