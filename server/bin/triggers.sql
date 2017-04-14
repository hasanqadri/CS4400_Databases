DELIMITER //
CREATE TRIGGER deny_user_username_change BEFORE UPDATE ON Users
FOR EACH ROW BEGIN
    IF NEW.username != OLD.username THEN
        SIGNAL sqlstate '45000' SET message_text = 'Users.username cannot be edited!';
    END IF;
END;//

CREATE TRIGGER deny_cityofficial_username_change BEFORE UPDATE ON City_officials
FOR EACH ROW BEGIN
    IF NEW.username != OLD.username THEN
        SIGNAL sqlstate '45000' SET message_text = 'City_officials.username cannot be edited!';
    END IF;
END;//

DELIMITER ;