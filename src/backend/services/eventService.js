import { pb } from '../config/pb.js';

// Funciones auxiliares que encapsulan el CRUD de eventos que no dependen del store de Pinia.
const createEvent = async (eventData) => {
	try {
		const event = await pb.collection('events').create(eventData);
		return event;
	} catch (error) {
		throw new Error('Error creating event: ' + error.message);
	}
};

// Recupera todos los eventos disponibles para el usuario autenticado.
const getAllEvents = async () => {
	try {
		return await pb.collection('events').getFullList();
	} catch (error) {
		throw new Error('Error fetching events: ' + error.message);
	}
};

// Aplica un filtrado en memoria a todos los eventos según los campos de filters.
const getEventsByFilters = async (filters = {}) => {
	try {
		const events = await getAllEvents();
		const {
			searchText = '',
			category = '',
			priority = '',
			dateFrom = '',
			dateTo = '',
			withReminder = false
		} = filters;

		const normalizedSearch = searchText.trim().toLowerCase();
		const fromDate = dateFrom ? new Date(dateFrom) : null;
		const toDate = dateTo ? new Date(dateTo) : null;

		return events.filter((event) => {
			if (normalizedSearch) {
				const matchInText = ['title', 'description', 'location'].some((field) => {
					const value = event[field];
					return (
						typeof value === 'string' &&
						value.toLowerCase().includes(normalizedSearch)
					);
				});
				if (!matchInText) {
					return false;
				}
			}

			if (category && event.category !== category) {
				return false;
			}

			if (priority && event.priority !== priority) {
				return false;
			}

			if (fromDate) {
				const eventDate = event.date ? new Date(event.date) : null;
				if (!eventDate || eventDate < fromDate) {
					return false;
				}
			}

			if (toDate) {
				const eventDate = event.date ? new Date(event.date) : null;
				if (!eventDate || eventDate > toDate) {
					return false;
				}
			}

			if (withReminder && !event.reminder) {
				return false;
			}

			return true;
		});
	} catch (error) {
		throw new Error('Error filtering events: ' + error.message);
	}
};

export { createEvent, getAllEvents, getEventsByFilters };
