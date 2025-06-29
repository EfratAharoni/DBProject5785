--1--
CREATE OR REPLACE VIEW view_ticket_info AS
SELECT 
    t.ticketid,
    t.price,
    t.saledate,
    c.cusname,
    e.eventtype
FROM 
    public.ticket t
JOIN 
    public.customers c ON t.cusid = c.cusid
JOIN 
    public.events e ON t.eventid = e.eventid;


SELECT * FROM view_ticket_info LIMIT 10;


--2--
CREATE OR REPLACE VIEW view_event_performers AS
SELECT 
    e.eventid,
    e.eventtype,
    p.performername
FROM 
    public.events e
JOIN 
    public.event_performer ep ON e.eventid = ep.eventid
JOIN 
    public.performer p ON ep.performerid = p.performerid;


SELECT * FROM view_event_performers LIMIT 10;
