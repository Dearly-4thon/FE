/* src/pages/Mailbox/components/MailboxHeader.jsx */
import { ArrowLeft } from "lucide-react";

export default function MailboxHeader({ title = "수신함", onBack }) {
  return (
    <header className="mailbox-header" style={styles.header}>

    </header>
  );
}

const styles = {
  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    all: "unset",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    cursor: "pointer",
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
  },
};
