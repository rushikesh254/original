import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 4,
  },
});

export async function generatePDF(recipe) {
  if (typeof window !== "undefined" && window.Worker) {
    const worker = new Worker("/pdf-worker.js");
    return new Promise((resolve, reject) => {
      worker.postMessage({ recipe });
      worker.onmessage = (e) => {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data); // Returns pdfBytes
        }
        worker.terminate();
      };
      worker.onerror = (err) => {
        reject(err);
        worker.terminate();
      };
    });
  }
  throw new Error("Web Workers are not supported in this browser.");
}

export function RecipePDF({ recipe }) {
  // Safely calculate total time with defaults
  const prepTime = parseInt(recipe?.prepTime) || 0;
  const cookTime = parseInt(recipe?.cookTime) || 0;
  const totalTime = prepTime + cookTime;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{recipe?.title || "Untitled Recipe"}</Text>
        <Text style={styles.text}>{recipe?.description || ""}</Text>

        {/* Meta */}
        <View style={styles.section}>
          <Text>
            Cuisine: {recipe?.cuisine || "N/A"} | Category:{" "}
            {recipe?.category || "N/A"}
          </Text>
          <Text>Time: {totalTime > 0 ? `${totalTime} mins` : "N/A"}</Text>
          <Text>Servings: {recipe?.servings || "N/A"}</Text>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.heading}>Ingredients</Text>
          {(recipe?.ingredients || []).map((ing, i) => (
            <Text key={i} style={styles.text}>
              • {ing?.item || "Unknown"} – {ing?.amount || "N/A"}
            </Text>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.heading}>Instructions</Text>
          {(recipe?.instructions || []).map((step, index) => (
            <View key={step?.step || index} style={{ marginBottom: 6 }}>
              <Text>
                {step?.step || index + 1}. {step?.title || "Step"}
              </Text>
              <Text>{step?.instruction || ""}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        {recipe?.tips?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Chef’s Tips</Text>
            {recipe.tips.map((tip, i) => (
              <Text key={i}>• {tip}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
