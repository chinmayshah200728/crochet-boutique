UPDATE settings SET value=json_set(value,'$.shipping',4000,'$.announcement','Free delivery above ₹499 · ₹40 on orders up to ₹499') WHERE id='store';
