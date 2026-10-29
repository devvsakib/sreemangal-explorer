# Sreemangal Explorer (শ্রীমঙ্গল এক্সপ্লোরার)
> **Explore Sreemangal. Your way.**

A production-minded, fullstack tourism coordination platform for Sreemangal and the greater Moulvibazar region in Bangladesh. Designed for Bangladeshi travelers looking for transparent transport options (CNG auto-rickshaws, 4x4 Chander Gari open jeeps, AC microbuses, and bicycles), certified local forest naturalists, and authentic tea garden experiences.

---

## 1. Product Overview

- **Regional Focus:** Sreemangal, Kamalganj, Hail Haor, and Rajkandi Reserve Forest in Moulvibazar, Bangladesh.
- **Problem Solved:** Tourists routinely face stressful tout negotiations, uncertain vehicle condition, unverified guides, and hidden surcharges at transit hubs like Sreemangal Railway Station.
- **Business Model:** Zero-budget friendly local marketplace. The founder coordinates early booking requests directly with verified driver syndicates (Jeep Syndicate, CNG Drivers Welfare) via phone and WhatsApp. Revenue comes from a mutually agreed referral commission (10–12%) upon completed trips. No up-front charges are imposed on providers.
- **Core Workflow:** All submissions are verified booking requests (not unconfirmed instant reservations). Our local coordinator verifies provider availability, issues a transparent quote, and requires mutual acceptance before marking bookings confirmed.

---

## 2. Technology Stack

- **Frontend:** React 19, Tailwind CSS v4, Lucide React icons, Plus Jakarta Sans & Hind Siliguri typography.
- **State & Data Store:** Modular persistent data adapter with local fallback and PostgreSQL/Supabase schema compatibility.
- **Database Schema:** Full SQL migrations with Row-Level Security (RLS) in `supabase/migrations/20261029000000_initial_schema.sql`.
- **Validation & Logic:** Pure decoupled business logic modules in `src/lib/bookingLogic.ts` tested with Node.js test runner (`node:test`).
- **Integrations:** Direct WhatsApp (`wa.me`) click-to-chat links with prefilled reference parameters.

---

## 3. Database Architecture & Tables

1. `profiles`: Admin and provider profile records referencing auth.users.
2. `places`: Sreemangal tourist attractions (Lawachara, Baikka Beel, Madhabpur Lake, Nurjahan Tea Estate, Hum Hum Waterfall, Manipuri Village) with exact GPS coordinates, entry fees, and access caveats.
3. `providers`: Local syndicates and independent guide guilds with private dispatch contacts and agreed referral commission terms.
4. `vehicles`: Vehicle inventory (CNG, Chander Gari 4x4, HiAce Microbus, Mountain Bicycle, Sedan) with seating capacities, luggage specs, driver inclusions, and pricing basis.
5. `guides`: Certified naturalists and cultural guides with language fluency, group limits, and specialty areas.
6. `booking_requests`: Customer requests with unguessable references (`SRE-XXXX-XXXX`), validation, quote tracking, commission calculations, and timestamped state transitions (`new` -> `reviewing` -> `awaiting_provider` -> `quoted` -> `awaiting_customer` -> `confirmed` -> `completed` -> `cancelled`).
7. `booking_status_history`: Auditable history of all status changes.
8. `reviews`: Moderated reviews for verified completed trips.

---

## 4. Setup & Local Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sreemangal-explorer

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server on port 3000
npm run dev
```

### Running Tests
Unit tests use Node's built-in test runner (`node:test`):
```bash
npx --yes tsx --test src/lib/bookingLogic.test.ts
```

### Production Build
```bash
npm run build
```

---

## 5. Supabase Setup (Optional Cloud Persistence)

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Copy and run the migration script located at `supabase/migrations/20261029000000_initial_schema.sql`.
4. Copy your Project URL and Anon Key into your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. **Secure First-Admin Setup:**
   - In Supabase Auth, invite your administrator email.
   - In the SQL Editor, promote that user to admin:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
     ```

---

## 6. Admin Portal Demo Credentials

In the local demonstration environment, click **Admin Portal** in the navigation header or visit `/admin`:
- **Email:** `admin@sreemangal.com`
- **Password:** `sreemangal2026`

From the Admin Portal, you can:
- Triage new customer requests.
- Assign local syndicates and record quotes in BDT.
- Confirm provider availability and customer acceptance.
- Track completed trip value and calculate/collect referral commissions.
- Edit destination visiting tips, entry fees, and vehicle listings.

---

## 7. Current Limitations & Future Roadmap

- **Current MVP:** Requests coordinated manually via phone and WhatsApp.
- **Roadmap:**
  - Automated WhatsApp Business API webhook notifications.
  - SMS gateway integration for automated driver dispatch notifications.
  - Native Bangla language switch with reviewed translations.
  - Multi-day custom package builder for corporate and university groups.
