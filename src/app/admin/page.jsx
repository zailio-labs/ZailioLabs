// src/app/admin/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, replied
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0
  });

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/requests?status=${filter === 'all' ? '' : filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setRequests(data.contacts);
        setStats({
          total: data.contacts.length,
          unread: data.unreadCount,
          read: data.contacts.filter(r => r.status === 'read').length,
          replied: data.contacts.filter(r => r.status === 'replied').length
        });
      } else {
        toast.error('Failed to fetch requests');
      }
    } catch (error) {
      toast.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          action: 'mark-read'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Marked as read');
        fetchRequests();
      }
    } catch (error) {
      toast.error('Error updating request');
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSendingEmail(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contactId: selectedRequest._id,
          message: replyMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Reply sent successfully');
        setReplyModal(false);
        setReplyMessage('');
        fetchRequests();
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      toast.error('Error sending reply');
    } finally {
      setSendingEmail(false);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/requests?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Request deleted');
        fetchRequests();
      }
    } catch (error) {
      toast.error('Error deleting request');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: 'bg-red-100 text-red-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800'
    };
    
    const icons = {
      unread: '🔴',
      read: '🟡',
      replied: '🟢'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9158]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">🔴</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-800">{stats.unread}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🟡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-800">{stats.read}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🟢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-800">{stats.replied}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-[#2f9158] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 All Requests
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔴 Unread ({stats.unread})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🟡 Read
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'replied' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🟢 Replied
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4">📭</span>
            <h3 className="text-xl font-semibold text-gray-600">No requests found</h3>
            <p className="text-gray-500">There are no contact requests matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.service || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setReplyModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                          title="Reply via Email"
                        >
                          ✉️ Reply
                        </button>
                        
                        {request.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(request._id)}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                            title="Mark as Read"
                          >
                            👁️ Read
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteRequest(request._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                          title="Delete Request"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">✉️ Reply to {selectedRequest.name}</h2>
              <p className="text-gray-600">Send an email response via Zoho Mail</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Original Message:</h3>
                <p className="text-gray-600">{selectedRequest.message}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply Message:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f9158] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Type your response here..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setReplyModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sendingEmail}
                className="px-4 py-2 bg-[#2f9158] text-white rounded-lg hover:bg-[#267045] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {sendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  '📤 Send Reply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
