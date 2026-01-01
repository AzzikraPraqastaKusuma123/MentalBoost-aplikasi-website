<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // Send a message
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'data' => $message->load('sender', 'receiver')
        ], 201);
    }

    // Get messages between current user and another user
    public function getMessages($userId)
    {
        $currentUserId = Auth::id();

        $messages = Message::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark all messages from the other user as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    // Get contacts (for counselor dashboard or user list)
    public function getContacts()
    {
        $user = Auth::user();
        $currentUserId = $user->id;
        
        if ($user->role === 'counselor') {
            // Counselors see users who have messaged them
            $contacts = User::where('role', '!=', 'counselor')
                ->get()
                ->map(function ($contact) use ($currentUserId) {
                    // Get last message between counselor and this user
                    $lastMessage = Message::where(function ($query) use ($currentUserId, $contact) {
                        $query->where('sender_id', $currentUserId)
                              ->where('receiver_id', $contact->id);
                    })->orWhere(function ($query) use ($currentUserId, $contact) {
                        $query->where('sender_id', $contact->id)
                              ->where('receiver_id', $currentUserId);
                    })
                    ->orderBy('created_at', 'desc')
                    ->first();

                    // Count unread messages (messages sent by contact to counselor that are unread)
                    $unreadCount = Message::where('sender_id', $contact->id)
                        ->where('receiver_id', $currentUserId)
                        ->where('is_read', false)
                        ->count();

                    $contact->unread_count = $unreadCount;
                    $contact->last_message = $lastMessage ? $lastMessage->message : null;
                    $contact->last_message_time = $lastMessage ? $lastMessage->created_at : null;
                    
                    return $contact;
                })
                ->sortByDesc('last_message_time') // Sort by latest message
                ->values(); // Re-index array
        } else {
            // Users see counselors
            $contacts = User::where('role', 'counselor')
                ->get()
                ->map(function ($contact) use ($currentUserId) {
                    $lastMessage = Message::where(function ($query) use ($currentUserId, $contact) {
                        $query->where('sender_id', $currentUserId)
                              ->where('receiver_id', $contact->id);
                    })->orWhere(function ($query) use ($currentUserId, $contact) {
                        $query->where('sender_id', $contact->id)
                              ->where('receiver_id', $currentUserId);
                    })
                    ->orderBy('created_at', 'desc')
                    ->first();

                    $unreadCount = Message::where('sender_id', $contact->id)
                        ->where('receiver_id', $currentUserId)
                        ->where('is_read', false)
                        ->count();

                    $contact->unread_count = $unreadCount;
                    $contact->last_message = $lastMessage ? $lastMessage->message : null;
                    $contact->last_message_time = $lastMessage ? $lastMessage->created_at : null;
                    
                    return $contact;
                })
                ->sortByDesc('last_message_time')
                ->values();
        }

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }
}
