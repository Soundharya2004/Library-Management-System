// index.js or your main component
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import Dashboard from './dashboard';
import Home from './home';
import DashboardWrapper from '../components/DashboardWrapper';
import StudentDashboard from './studentdashboard';

const Stack = createStackNavigator();
 
const Index = () => {
  return (
    <Stack.Navigator>

      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ headerShown: false }} />

      <Stack.Screen name="DashboardWrapper" component={DashboardWrapper} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Index;
