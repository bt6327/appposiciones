
'use client';

import { useState, useMemo, ReactNode } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
const valuerow= 5;
function Draggable({ id, data, children }: { id: any, data: any, children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
    cursor: 'grabbing',
  } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      {children}
    </div>
  );
}

function Droppable({ id, children }: { id: any, children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="h-full w-full">
      {children}
    </div>
  );
}

export default function Home() {
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const [attendees, setAttendees] = useState('');
  const [assignments, setAssignments] = useState<any>({});
  const [isDragging, setIsDragging] = useState(false);

  const totalSeats = useMemo(() => {
    return tableData.reduce((total, table) => total + (table.seats - 1), 0);
  }, [tableData]);

  const assignAttendees = () => {
    const attendeeList = attendees.split('\n').filter(name => name.trim() !== '');
    if (attendeeList.length > totalSeats) {
      alert("No se pueden asignar más participantes que puestos disponibles.");
      return;
    }

    const availableSeats: any[] = [];
    tableData.forEach(table => {
      for (let i = 0; i < table.seats; i++) {
        if (i !== 1) { // Position 2 (index 1) is for the Crupier
          availableSeats.push({ tableId: table.id, chairIndex: i });
        }
      }
    });

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const shuffledAttendees = shuffleArray([...attendeeList]);
    const shuffledSeats = shuffleArray(availableSeats);

    const newAssignments: any = {};
    tableData.forEach(table => {
      newAssignments[table.id] = {};
    });

    shuffledAttendees.forEach((attendee, index) => {
      if (index < shuffledSeats.length) {
        const seat = shuffledSeats[index];
        newAssignments[seat.tableId][seat.chairIndex] = attendee;
      }
    });

    setAssignments(newAssignments);
  };

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count >= 0) {
      setNumberOfTables(count);
      setTableData(Array.from({ length: count }, (_, i) => ({ id: i + 1, seats: 9 })));
    } else {
      setNumberOfTables(0);
      setTableData([]);
    }
    setAssignments({});
  };

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAttendees = e.target.value;
    const newAttendeeCount = newAttendees.split('\n').filter(name => name.trim() !== '').length;
    if (newAttendeeCount > totalSeats && totalSeats > 0) {
      alert("No se pueden agregar más participantes que puestos disponibles.");
    } else {
      setAttendees(newAttendees);
    }
  };

  const handleFinalize = () => assignAttendees();
  const handleUpdate = () => assignAttendees();

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragEnd(event: any) {
    setIsDragging(false);
    const { active, over } = event;
    if (!over || !active.data.current) return;

    const { tableId: fromTableId, chairIndex: fromChairIndex } = active.data.current;

    if (over.id === 'garbage-collector') {
      const participantToRemove = assignments[fromTableId]?.[fromChairIndex];
      if (participantToRemove) {
        setAssignments((prev: any) => {
          const newAssignments = { ...prev };
          delete newAssignments[fromTableId][fromChairIndex];
          return newAssignments;
        });
        setAttendees((prev: string) => prev.split('\n').filter(name => name.trim() !== participantToRemove.trim()).join('\n'));
      }
      return;
    }

    if (over.id.startsWith('chair-')) {
        const [ , toTableId, toChairIndex] = over.id.split('-').map(Number);

        if (toChairIndex === 1) return; // Cannot drop on Crupier seat
        if (fromTableId === toTableId && fromChairIndex === toChairIndex) return;

        setAssignments((prev: any) => {
            const participantAtTarget = prev[toTableId]?.[toChairIndex];

            if (participantAtTarget) {
                return prev;
            }

            const newAssignments = JSON.parse(JSON.stringify(prev));
            const participantToMove = newAssignments[fromTableId]?.[fromChairIndex];

            if (!participantToMove) {
                return prev;
            }

            if (!newAssignments[toTableId]) {
                newAssignments[toTableId] = {};
            }

            newAssignments[toTableId][toChairIndex] = participantToMove;
            delete newAssignments[fromTableId][fromChairIndex];

            return newAssignments;
        });
    }
  }

  const attendeeCount = useMemo(() => attendees.split('\n').filter(name => name.trim() !== '').length, [attendees]);

  const chairPositions = [
    { top: '0%', left: '25%' }, { top: '0%', left: '50%' }, { top: '0%', left: '75%' },
    { top: '100%', left: '25%' }, { top: '100%', left: '50%' }, { top: '100%', left: '75%' },
    { top: '50%', left: '0%' },
    { top: '33%', left: '100%' }, { top: '66%', left: '100%' }
  ];

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen flex-col items-center p-4" style={{ backgroundColor: '#f0f8ff' }}>
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg mb-8">
            <div className="relative mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Configuración de Mesas</h1>
                <p className="text-gray-600">Define el número de mesas para tu evento</p>
            </div>
            <div className="mb-6">
              <label htmlFor="table-number" className="block text-lg font-medium text-gray-700">Número de Mesas</label>
              <input id="table-number" type="number" className="mt-2 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" onChange={handleTableNumberChange} value={numberOfTables === 0 ? '' : numberOfTables} min="0" />
            </div>
        </div>

        {tableData.map((table) => (
          <div key={table.id} className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg mb-8">
              <div className="flex items-center mb-4 flex-wrap">
                  <h2 className="text-lg font-semibold text-gray-800 mr-4">Mesa {table.id}</h2>
                  <div className="flex flex-wrap gap-2">
                      {Object.values(assignments[table.id] || {}).map((name: any, i) => (
                          <span key={i} className="bg-[#99453D] text-black text-sm font-bold px-3 py-1 rounded-full">{name}</span>
                      ))}
                  </div>
              </div>
              <div className="flex justify-center">
                  <div className="relative w-96 h-64" style={{ marginTop: '20px' }}>
                      <img src="/poker_table.png" alt={`Poker Table ${table.id}`} className="h-full w-full" />
                      {chairPositions.map((style, i) => {
                          const isCrupier = i === 1;
                          const attendeeName = isCrupier ? "Crupier" : assignments[table.id]?.[i];
                          const bgColor = isCrupier ? "bg-red-700" : "bg-[#99453D]";
                          const textColor = isCrupier ? "text-white" : "text-black font-bold";
                          const droppableId = `chair-${table.id}-${i}`;
                          const isDraggable = !!attendeeName && !isCrupier;

                          return (
                              <div key={i} className="absolute w-16 h-16" style={{ ...style, transform: 'translate(-50%, -50%)' }}>
                                  <Droppable id={droppableId}>
                                      <div className={`w-full h-full ${bgColor} ${textColor} rounded-full flex items-center justify-center text-sm text-center p-1 break-words`}>
                                          {isDraggable ? (
                                              <Draggable id={`participant-${table.id}-${i}`} data={{ tableId: table.id, chairIndex: i }}>
                                                  {attendeeName}
                                              </Draggable>
                                          ) : (
                                              attendeeName || ''
                                          )}
                                      </div>
                                  </Droppable>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
        ))}

        {isDragging && (
          <div className="fixed bottom-10 right-10 z-50">
            <Droppable id="garbage-collector">
              <div className="p-4 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </Droppable>
          </div>
        )}

        {numberOfTables > 0 && (
          <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Participantes</h1>
              <p className="text-gray-600">Ingrese los nombres de los asistentes</p>
            </div>
            <div className="relative mb-6">
              <textarea id="attendees" className="peer w-full rounded-md border border-gray-300 p-4 text-lg text-gray-800 placeholder-transparent focus:border-blue-500 focus:outline-none" placeholder="Participantes" rows= {valuerow} onChange={handleAttendeesChange} value={attendees}></textarea>
              <label htmlFor="attendees" className="absolute -top-3.5 left-3 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">Participantes (uno por línea)</label>
            </div>
            <div className="flex space-x-4">
              <button onClick={handleFinalize} className="w-full rounded-md bg-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50" disabled={attendeeCount > totalSeats}>Finalizar</button>
              <button onClick={handleUpdate} className="w-full rounded-md bg-green-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50" disabled={attendeeCount > totalSeats}>Actualizar</button>
            </div>
          </div>
        )}

        {numberOfTables > 0 && (
          <div className="mt-8 w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Resumen</h1>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg bg-gray-100 p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Total de Asistentes</h2>
                <p className="text-3xl font-bold text-green-500">{attendeeCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
