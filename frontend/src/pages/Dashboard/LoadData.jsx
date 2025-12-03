import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import RegularDashboard from './RegularDashboard';
import ManagerDashboard from './ManagerDashboard';
import CashierDashboard from './CashierDashboard';
import { getMyTransactions } from '../../apis/UsersApi'; 

/**
 * Fetches the user's transaction data 
 * for dashboard visualizations and passes it to 
 * the role specific dashboards
 */
export function LoadData() {
    const { user } = useUser();
    const [transactions, setTransactions] = useState(null); 

    // Fetch user's transactions upon loading the dashboard
    useEffect(() => {
        const loadTransactions = async () => {
            if (!localStorage.getItem('token')) {
                 setTransactions([]);
                 return;
            }
            try {
                const myTrans = await getMyTransactions(localStorage.getItem('token'));
                setTransactions(myTrans.results); 
            } catch (error) {
                console.error("Failed to load user transactions for dashboard:", error);
                setTransactions([]);
            }
        };
        if (user?.id) { 
            loadTransactions();
        }
    }, [user?.id]); 

    const renderDashboard = (role) => {
        const props = { 
            transactions: transactions, 
        };

        switch (role) {
            case "superuser":
            case "manager":
                return <ManagerDashboard {...props} />;
            case "regular":
                return <RegularDashboard {...props} />;
            case "cashier":
                return <CashierDashboard {...props} />;
        }
    };

    if (transactions === null) {
        return <div style={{ padding: '2rem' }}>Loading dashboard data...</div>;
    }
    
    return renderDashboard(user.role);
}