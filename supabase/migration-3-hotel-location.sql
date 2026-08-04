-- Adds the "Hotel Location" field to the contact/enquiry form.
alter table inquiries add column if not exists hotel_location text;
