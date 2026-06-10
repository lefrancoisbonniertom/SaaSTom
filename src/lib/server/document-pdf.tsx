import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#17201b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe4d8",
  },
  brand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  businessInfo: {
    fontSize: 9,
    color: "#66705f",
    textAlign: "right",
    lineHeight: 1.5,
  },
  meta: {
    fontSize: 9,
    color: "#8c9785",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  client: {
    fontSize: 10,
    color: "#66705f",
    marginBottom: 18,
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#8c9795",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#dfe4d8",
    paddingTop: 8,
  },
});

export type DocumentPdfInput = {
  title: string;
  type: string;
  content: string;
  clientName: string | null;
  createdAt: Date;
};

function DocumentPdf({ title, type, content, clientName, createdAt }: DocumentPdfInput) {
  const dateLabel = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(createdAt);

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>SaaSTom</Text>
          <View>
            <Text style={styles.businessInfo}>Tom Lefrancois Bonnier - Micro-Entreprise</Text>
            <Text style={styles.businessInfo}>7 Grande Rue, 77114 Villiers-sur-Seine</Text>
            <Text style={styles.businessInfo}>SIRET 101 407 914 00015</Text>
          </View>
        </View>

        <Text style={styles.meta}>
          {type} · {dateLabel}
        </Text>
        <Text style={styles.title}>{title}</Text>
        {clientName ? <Text style={styles.client}>Client : {clientName}</Text> : null}

        <Text style={styles.content}>{content}</Text>

        <Text fixed style={styles.footer}>
          Document généré via SaaSTom - Tom Lefrancois Bonnier - SIRET 101 407 914 00015 - TVA non applicable, art.
          293 B du CGI
        </Text>
      </Page>
    </Document>
  );
}

export async function renderDocumentPdf(input: DocumentPdfInput): Promise<Buffer> {
  return renderToBuffer(<DocumentPdf {...input} />);
}

export function slugifyDocumentTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || "document";
}
