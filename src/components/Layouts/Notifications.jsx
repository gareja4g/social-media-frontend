import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown visibility
  const authToken = useSelector((state) => state.auth.token);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const result = await response.json();

      setNotifications(result.data);
      setNotificationCount(result.data.filter((notif) => !notif.read).length); // Count unread notifications
    } catch (error) {
      setApiError(error.message);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchNotifications();
    }
  }, [authToken]);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown visibility
  };

  // Optionally, close dropdown if clicked outside (use this if you want that behavior)
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  // Attach event listener for clicking outside of dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/read/${notificationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        // Update the local notifications state to mark the notification as read
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );

        // Update the notification count for unread notifications
        setNotificationCount((prevCount) => prevCount - 1); // Decrease the unread count by 1
      } else {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
      <li className="nav-item dropdown">
        <a
          className="nav-link"
          href="#"
          id="dropdownMenuLink"
          role="button"
          onClick={toggleDropdown} // Trigger the toggle on click
          aria-haspopup="true"
          aria-expanded={isDropdownOpen ? "true" : "false"}
        >
          <i className="far fa-bell"></i>
          <span className="badge badge-warning navbar-badge">
            {notificationCount}
          </span>
        </a>
        <div
          className={`dropdown-menu dropdown-menu-xl dropdown-menu-right ${
            isDropdownOpen ? "show" : ""
          }`} // Conditionally add 'show' class based on dropdown state
          aria-labelledby="dropdownMenuLink"
        >
          <span className="dropdown-header">
            {notificationCount} Notifications
          </span>
          <div className="dropdown-divider"></div>

          {/* Loop through last 5 notifications */}
          {notifications &&
            notifications.slice(0, 5).map((notification, index) => (
              <React.Fragment key={index}>
                <a
                  className="dropdown-item"
                  onClick={() => markAsRead(notification.id)} // Mark notification as read on click
                  style={{
                    fontWeight: notification.read ? "normal" : "bold", // Make unread notifications bold
                  }}
                >
                  <i className="fas fa-bell mr-2"></i> {notification.message}
                  <span className="float-right text-muted text-sm">
                    {notification?.created_at_human}
                  </span>
                </a>
                <div className="dropdown-divider"></div>
              </React.Fragment>
            ))}

          <a className="dropdown-item dropdown-footer">See All Notifications</a>
        </div>
      </li>
    </ul>
  );
};

export default Notification;
