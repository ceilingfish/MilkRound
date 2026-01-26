-- MilkRound Database Schema - Enum Types

CREATE TYPE ScheduleType AS ENUM ('Daily', 'Weekly', 'Monthly');
CREATE TYPE DayOfWeek AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
CREATE TYPE WeekOfMonth AS ENUM ('First', 'Second', 'Third', 'Last');
CREATE TYPE DeliveryStatus AS ENUM ('Pending', 'Locked', 'Cancelled', 'Delivered');
CREATE TYPE SubscriptionStatus AS ENUM ('Cancelled', 'Active');
