// Reference: https://refine.dev/blog/recharts/#introduction

import Typography from '@mui/material/Typography';
import { 
    BarChart, 
    Bar,      
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './VisualizationData.css'; 

const processTransactionFrequency = (transactions) => {
    if (!transactions) return [];

    const frequencyMap = {}; 
    
    transactions.forEach(t => {
        const typeKey = (t.type || 'unknown').toLowerCase().trim(); 
        
        const displayName = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
        
        if (!frequencyMap[displayName]) {
            frequencyMap[displayName] = { name: displayName, count: 0 };
        }
        
        frequencyMap[displayName].count += 1;
    });
    
    return Object.values(frequencyMap);
};

const TYPE_COLORS = {
    Purchase: "#1976d2",     
    Redemption: "#9c27b0",   
    Adjustment: "#ef5350",
    Event: "#a4cd2aff",  
    Unknown: "#757575"       
};

export function TypeHistory({ transactions }) {
    const transactionFrequency = processTransactionFrequency(transactions);
    
    // Calculate total transactions
    const totalTransactions = transactionFrequency.reduce((sum, item) => sum + item.count, 0);

    const CHART_MARGINS = { top: 10, right: 10, left: 35, bottom: 50 };
    const XAXIS_HEIGHT = 50; 

    return (
        <Card className="history-card" sx={{ boxShadow: 3 }}>
            <CardContent>
                <div className="chart-wrapper">
                    
                    <Typography variant="h6" component="h4" className="chart-title">
                        📊 My Transaction Activity by Type
                    </Typography>
                    
                    <Typography variant="h4" color="primary" className="total-count-text">
                        {totalTransactions} Total Actions
                    </Typography>
                    
                    {transactionFrequency.length === 0 ? (
                        <Typography color="textSecondary" className="no-data-text">
                            No transaction history available yet.
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={transactionFrequency}
                                margin={CHART_MARGINS}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" /> 
                                
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#555" 
                                    label={{ 
                                        value: 'Transaction Type', 
                                        position: 'bottom',
                                        dy: -2
                                    }}
                                    height={XAXIS_HEIGHT}
                                    tickLine={false}
                                />

                                <YAxis 
                                    stroke="#555" 
                                    label={{ 
                                        value: 'Frequency', 
                                        angle: -90, 
                                        position: 'outside',
                                        dx: -25
                                    }}
                                /> 

                                <Tooltip 
                                    formatter={(value) => [`${value} times`, 'Frequency']}
                                    labelFormatter={(label) => `Type: ${label}`}
                                />
                                
                                <Bar 
                                    dataKey="count" 
                                    name="Frequency"
                                    radius={[4, 4, 0, 0]}
                                >
                                    {transactionFrequency.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={TYPE_COLORS[entry.name] || TYPE_COLORS.Unknown}
                                        />
                                    ))}
                                </Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}