import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '../supabase';
import { completeMission } from '../services/missionService';

const GEMINI_API_KEY = 'AQ.Ab8RN6IWyBl9jrNTwao1IFSaCRhtGvnJDLZ4E_dZ-EDTalzG0A';

const BANCO_ESCENARIOS = [
  "Un integrante de tu equipo no hizo su parte del trabajo y te pide que pongas su nombre minutos antes de la entrega. ¿Qué le dices?",
  "Un amigo te pide dinero prestado por tercera vez sin haberte pagado las dos anteriores. ¿Cómo te niegas sin perder la amistad?",
  "En un restaurante te traen un platillo equivocado y el mesero insiste en que eso fue lo que pediste. ¿Cómo lo manejas?",
  "Tu jefe o profesor te pide quedarte horas extra el viernes por la tarde cuando ya tenías un compromiso familiar importante. ¿Qué respondes?",
  "Alguien se mete en la fila del banco o supermercado justo delante de ti fingiendo que no te vio. ¿Qué le dices?",
  "Un familiar hace un comentario crítico e incómodo sobre tu vida o futuro frente a todos en una cena. ¿Cómo marcas un límite?",
  "Tu compañero de casa deja los platos sucios acumulados por días e ignora tus indirectas. ¿Cómo inicias la conversación?",
  "Estás en una entrevista de trabajo y te preguntan cuál es tu mayor debilidad. ¿Qué contestas para sonar honesto pero profesional?",
  "Un vecino tiene música a todo volumen a las 2:00 AM entre semana y mañana debes madrugar. ¿Cómo se lo pides al tocar su puerta?",
  "En una reunión grupal, una persona te interrumpe constantemente cada vez que intentas dar tu opinión. ¿Cómo recuperas la palabra con firmeza?",
  "Compraste un producto defectuoso y el encargado de la tienda se niega a hacerte válida la garantía. ¿Cómo negocias una solución?",
  "Un amigo cancela los planes a última hora por cuarta vez consecutiva con una excusa poco creíble. ¿Qué le dices?",
  "Cometiste un error importante en un proyecto grupal que afectará el resultado de tus compañeros. ¿Cómo asumes la responsabilidad ante ellos?",
  "Llegas a un evento social donde no conoces a absolutamente nadie. ¿Cómo te acercas a un grupo para integrarte a la plática?",
  "Un compañero se lleva el crédito frente al jefe o profesor por una idea que tú propusiste ayer. ¿Cómo intervienes en ese momento?",
  "Te piden un favor que requiere mucho tiempo en una semana donde estás saturado de pendientes. ¿Cómo dices que no asertivamente?",
  "Dos compañeros de tu equipo empiezan a discutir de forma agresiva, bloqueando el avance de todos. ¿Cómo medias la situación?",
  "Te ofrecen un trabajo que te interesa, pero el sueldo es menor al que esperabas. ¿Cómo planteas una negociación salarial?",
  "Una persona cercana te cuenta un problema personal grave buscando desahogarse, pero no sabes qué aconsejarle. ¿Qué le dices para mostrar empatía?",
  "El chofer de un taxi toma una ruta más larga a propósito para cobrarte de más. ¿Cómo lo confrontas de forma segura y firme?",
  "Un cliente o desconocido te habla con tono grosero por un retraso que no fue tu culpa. ¿Cómo lo calmas sin perder la compostura?",
  "Debes darle retroalimentación a un compañero cuyo trabajo tiene mala calidad, pero sabes que es muy sensible a las críticas. ¿Cómo se lo dices?",
  "Tus amigos te presionan para ir a un viaje o cena costosa que sale por completo de tu presupuesto actual. ¿Cómo explicas tu postura sin sentirte mal?",
  "Durante una exposición en público, se te olvida por completo lo que ibas a decir y todos te miran en silencio. ¿Cómo sales del paso?",
  "Un compañero te envía mensajes de trabajo o escuela a medianoche esperando respuestas inmediatas. ¿Cómo estableces un horario límite?",
  "Prestaste un objeto valioso a un conocido y te lo devuelve dañado sin ofrecer disculpas ni reponerlo. ¿Qué le dices?",
  "Estás hablando de algo importante con alguien y notas que solo mira su celular ignorándote. ¿Cómo le pides atención de manera asertiva?",
  "En una lluvia de ideas, propones algo y nadie te hace caso; minutos después alguien repite tu idea y todos la aplauden. ¿Cómo reaccionas?",
  "Un vendedor muy insistente te aborda y no acepta un 'no, gracias' por respuesta. ¿Cómo cortas la interacción educadamente?",
  "Necesitas pedirle una carta de recomendación a un antiguo profesor o jefe con quien no hablas desde hace un año. ¿Cómo inicias el mensaje?"
];

export default function RoleplayScreen() {
  const [respuesta, setRespuesta] = useState('');
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [escenarioActual, setEscenarioActual] = useState('');

  const cargarNuevoEscenario = () => {
    const indiceAleatorio = Math.floor(Math.random() * BANCO_ESCENARIOS.length);
    setEscenarioActual(BANCO_ESCENARIOS[indiceAleatorio]);
    setRespuesta('');
    setEvaluacion(null);
  };

  useEffect(() => {
    cargarNuevoEscenario();
  }, []);

  async function evaluarRespuesta() {
    if (!respuesta.trim()) return;
    setLoading(true);

    const prompt = `Actúa como un evaluador de habilidades blandas (comunicación asertiva, negociación y manejo de conflictos cotidianos).
    Escenario: "${escenarioActual}"
    Respuesta del usuario: "${respuesta}"
    Evalúa la asertividad, empatía y resolución de conflictos. Responde ÚNICAMENTE con un objeto JSON válido (sin bloques de código ni markdown) con esta estructura exacta:
    {"puntaje": (número del 1 al 10), "feedback": "(consejo directo de máximo 2 líneas)", "xp": (número entre 5 y 30 según su desempeño)}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("ERROR REAL DE GOOGLE:", data);
        Alert.alert('Error de API', 'Revisa la terminal de Expo para ver el motivo del rechazo.');
        setLoading(false);
        return;
      }

      const resultadoJSON = JSON.parse(data.candidates[0].content.parts[0].text);
      setEvaluacion(resultadoJSON);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('xp_total').eq('id', user.id).single();
        await completeMission(user.id, resultadoJSON.xp, profile?.xp_total || 0);
      }
    } catch (error) {
      console.error("Error de ejecución en React Native:", error);
      Alert.alert('Error del Sistema', 'Fallo interno al procesar la evaluación.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Simulador IA</Text>
          <Text style={styles.subtitle}>Entrena conversaciones difíciles sin riesgo.</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={cargarNuevoEscenario} disabled={loading}>
          <Text style={styles.refreshBtnText}>Otro Caso ↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scenarioCard}>
        <Text style={styles.label}>SITUACIÓN ACTUAL:</Text>
        <Text style={styles.scenarioText}>{escenarioActual}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Escribe exactamente qué le dirías..."
        placeholderTextColor="#71717a"
        multiline
        value={respuesta}
        onChangeText={setRespuesta}
      />

      <TouchableOpacity style={styles.btn} onPress={evaluarRespuesta} disabled={loading}>
        {loading ? <ActivityIndicator color="#121212" /> : <Text style={styles.btnText}>Enviar y Evaluar</Text>}
      </TouchableOpacity>

      {evaluacion && (
        <View style={styles.resultCard}>
          <Text style={styles.score}>Asertividad: {evaluacion.puntaje}/10  •  +{evaluacion.xp} XP</Text>
          <Text style={styles.feedback}>{evaluacion.feedback}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { color: '#4ade80', fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#a1a1aa', fontSize: 13 },
  refreshBtn: { backgroundColor: '#27272a', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46' },
  refreshBtnText: { color: '#e4e4e7', fontSize: 12, fontWeight: 'bold' },
  scenarioCard: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  label: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  scenarioText: { color: '#f4f4f5', fontSize: 15, lineHeight: 22 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 16 },
  btn: { backgroundColor: '#4ade80', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#121212', fontWeight: '900', fontSize: 15 },
  resultCard: { marginTop: 20, backgroundColor: '#14291e', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4ade80' },
  score: { color: '#4ade80', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  feedback: { color: '#d4d4d8', fontSize: 14, lineHeight: 20 }
});