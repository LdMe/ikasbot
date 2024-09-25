import React, { useState, useContext } from 'react';
import loggedInContext from "../../context/loggedInContext";
import { getCourses } from "../../util/api/course";
import { getSubjects } from "../../util/api/subject";
import { copyExercise } from "../../util/api/exercise"; // Asumimos que existe esta función

const CopyExercise = ({ exercise }) => {
  const [showCourses, setShowCourses] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);
  const { user } = useContext(loggedInContext);

  const handleShowCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const availableCourses = await getCourses();
      setCourses(availableCourses);
      setShowCourses(true);
    } catch (err) {
      setError("Error al cargar los cursos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setIsLoading(true);
    setError(null);
    try {
      const availableSubjects = await getSubjects(course._id);
      setSubjects(availableSubjects);
      setShowSubjects(true);
    } catch (err) {
      setError("Error al cargar los temas del curso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (targetSubjectId) => {
    setIsLoading(true);
    setError(null);
    try {
      await copyExercise(exercise._id, targetSubjectId);
      setCopyStatus({ type: 'success', message: "Ejercicio copiado exitosamente" });
    } catch (err) {
      setCopyStatus({ type: 'error', message: 'Error al copiar el ejercicio' });
    } finally {
      setIsLoading(false);
      setShowCourses(false);
      setShowSubjects(false);
    }
  };

  const resetSelection = () => {
    setShowCourses(false);
    setShowSubjects(false);
    setSelectedCourse(null);
    setSubjects([]);
  };

  if (user.role === "student") return null;

  return (
    <div style={{ marginTop: '20px' }}>
      {!showCourses && !showSubjects && (
        <button 
          onClick={handleShowCourses} 
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Cargando...' : 'Copiar a otro curso'}
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showCourses && !showSubjects && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Selecciona un curso:</h3>
          {courses.map((course) => (
            <button
              key={course._id}
              onClick={() => handleSelectCourse(course)}
              disabled={isLoading}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '10px', 
                marginBottom: '5px', 
                textAlign: 'left', 
                backgroundColor: '#f0f0f0', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {course.name}
            </button>
          ))}
          <button 
            onClick={resetSelection} 
            disabled={isLoading}
            style={{ 
              padding: '10px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              marginTop: '10px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {showSubjects && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Selecciona un tema en {selectedCourse.name}:</h3>
          {subjects.map((subject) => (
            <button
              key={subject._id}
              onClick={() => handleCopy(subject._id)}
              disabled={isLoading}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '10px', 
                marginBottom: '5px', 
                textAlign: 'left', 
                backgroundColor: '#f0f0f0', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {subject.name}
            </button>
          ))}
          <button 
            onClick={() => setShowSubjects(false)} 
            disabled={isLoading}
            style={{ 
              padding: '10px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              marginTop: '10px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            Volver a cursos
          </button>
        </div>
      )}

      {copyStatus && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: copyStatus.type === 'success' ? '#d4edda' : '#f8d7da',
          color: copyStatus.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${copyStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <strong>{copyStatus.type === 'success' ? 'Éxito' : 'Error'}</strong>: {copyStatus.message}
        </div>
      )}
    </div>
  );
};

export default CopyExercise;