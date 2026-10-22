CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`colour` text NOT NULL,
	`note` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`total` integer NOT NULL,
	`shipping` integer NOT NULL,
	`status` text DEFAULT 'awaiting_payment' NOT NULL,
	`payment_ref` text DEFAULT '' NOT NULL,
	`tracking` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`stock` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`colours` text DEFAULT '[]' NOT NULL,
	`model` text DEFAULT '' NOT NULL,
	`lead_time` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`body` text NOT NULL,
	`rating` integer NOT NULL,
	`product_id` text,
	`published` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
