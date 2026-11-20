import type { Libro } from "../types";

export const LIBROS: Libro[] = [
  {
    isbn: "9780307474728",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    anio: 1967,
    ejemplares: 3,
  },
  {
    isbn: "9789505631234",
    titulo: "El Aleph",
    autor: "Jorge Luis Borges",
    anio: 1949,
    ejemplares: 0,
  },
  {
    isbn: "9788420434536",
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    anio: 1963,
    ejemplares: 2,
  },
  {
    isbn: "9780156012195",
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    anio: 1943,
    ejemplares: 5,
  },
  {
    isbn: "9788491051250",
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    anio: 1605,
    ejemplares: 0,
  },
  {
    isbn: "9780061120084",
    titulo: "Matar a un ruiseñor",
    autor: "Harper Lee",
    anio: 1960,
    ejemplares: 1,
  },
  {
    isbn: "9780141439518",
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    anio: 1813,
    ejemplares: 0,
  },
  {
    isbn: "9780743273565",
    titulo: "El gran Gatsby",
    autor: "F. Scott Fitzgerald",
    anio: 1925,
    ejemplares: 2,
  },
  {
    isbn: "9780316769488",
    titulo: "El guardián entre el centeno",
    autor: "J. D. Salinger",
    anio: 1951,
    ejemplares: 0,
  },
  {
    isbn: "9780679783268",
    titulo: "Crimen y castigo",
    autor: "Fiódor Dostoievski",
    anio: 1866,
    ejemplares: 1,
  },
  {
    isbn: "9780451524935",
    titulo: "1984",
    autor: "George Orwell",
    anio: 1949,
    ejemplares: 4,
  },
  {
    isbn: "9788437604572",
    titulo: "La casa de los espíritus",
    autor: "Isabel Allende",
    anio: 1982,
    ejemplares: 0,
  },
  {
    isbn: "9788498386997",
    titulo: "Ficciones",
    autor: "Jorge Luis Borges",
    anio: 1944,
    ejemplares: 2,
  },
  {
    isbn: "9789507312345",
    titulo: "Sobre héroes y tumbas",
    autor: "Ernesto Sabato",
    anio: 1961,
    ejemplares: 1,
  },
  {
    isbn: "9780307743817",
    titulo: "La sombra del viento",
    autor: "Carlos Ruiz Zafón",
    anio: 2001,
    ejemplares: 3,
  },
];

// Datos iniciales para las listas de espera (A2)
export const ESPERAS_INICIALES: Record<string, string[]> = {
  "9789505631234": ["Ana", "Carlos"], // El Aleph
  "9780141439518": ["Lucía"], // Orgullo y prejuicio
};
