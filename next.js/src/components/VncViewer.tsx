'use client';

import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';

// Import VncScreen dynamically to avoid SSR issues
const VncScreen = dynamic(
  () => import('react-vnc').then((mod) => mod.VncScreen),
  { ssr: false }
);

interface ErrorEntry {
  message: string;
  timestamp: Date;
}

export default function VncViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<ErrorEntry[]>([]);
  const [isManualDisconnect, setIsManualDisconnect] = useState(true);
  const [password, setPassword] = useState('');
  const vncRef = useRef<any>(null);

  const addErrorToHistory = (errorMessage: string) => {
    setErrorHistory(prev => {
      const newHistory = [{ message: errorMessage, timestamp: new Date() }, ...prev].slice(0, 5);
      return newHistory;
    });
  };

  const formatTimestamp = (date: Date | undefined) => {
    if (!date) return 'Unknown time';
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid time';
    }
  };

  const handleConnect = () => {
    setError(null);
    setIsManualDisconnect(false);
    if (vncRef.current) {
      vncRef.current.connect();
    }
  };

  const handleDisconnect = () => {
    setIsManualDisconnect(true);
    if (vncRef.current) {
      vncRef.current.disconnect();
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 'bold'
      }}>
        VNC Remote Desktop Viewer
      </div>

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        alignItems: 'center'
      }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter VNC password"
          style={{
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '1em',
            width: '200px'
          }}
        />
        <button
          onClick={handleConnect}
          disabled={isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: isConnected ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          Connect
        </button>
        <button
          onClick={handleDisconnect}
          disabled={!isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: !isConnected ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          Disconnect
        </button>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: 'calc(100% - 120px)',
        border: '2px solid #007bff',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000000'
      }}>
        {!isManualDisconnect && (
          <VncScreen
            ref={vncRef}
            url="ws://localhost:5901"
            scaleViewport
            background="#000000"
            style={{
              width: '100%',
              height: '100%',
            }}
            {...(password ? {
              rfbOptions: {
                credentials: {
                  password: password
                }
              }
            } : {})}
            onConnect={() => {
              console.log('Connected to VNC server');
              setIsConnected(true);
              setError(null);
            }}
            onDisconnect={() => {
              console.log('Disconnected from VNC server');
              setIsConnected(false);
              if (!isManualDisconnect) {
                const errorMessage = 'Disconnected from VNC server';
                setError(errorMessage);
                addErrorToHistory(errorMessage);
              }
            }}
            onCredentialsRequired={(event) => {
              console.log('Credentials required for VNC connection');
              console.log(event);
              const errorMessage = 'VNC server requires credentials. Please enter the password.';
              setError(errorMessage);
              addErrorToHistory(errorMessage);
            }}
            onSecurityFailure={(event) => {
              const errorMessage = `Security failure for VNC connection: ${event.detail.reason}`;
              console.log(errorMessage);
              setError(errorMessage);
              addErrorToHistory(errorMessage);
            }}
          />
        )}
      </div>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        minHeight: '150px',
        maxHeight: '150px',
        overflowY: 'auto'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Error History:</div>
        {errorHistory.length > 0 ? (
          errorHistory.map((error, index) => (
            <div key={index} style={{
              padding: '5px 0',
              borderBottom: index < errorHistory.length - 1 ? '1px solid #ffeeba' : 'none',
              fontSize: '0.9em',
              display: 'flex',
              gap: '10px',
              alignItems: 'baseline'
            }}>
              <div style={{ color: '#666', fontSize: '0.8em', minWidth: '80px' }}>
                [{formatTimestamp(error.timestamp)}]
              </div>
              <div>{error.message}</div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '5px 0',
            fontSize: '0.9em',
            color: '#666',
            textAlign: 'center'
          }}>
            No errors yet
          </div>
        )}
      </div>
    </div>
  );
}