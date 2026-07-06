import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Option = {
  label: string;
  value: string;
};

interface LightDropdownSelectProps {
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function LightDropdownSelect({
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
}: LightDropdownSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 12,
          backgroundColor: '#ffffff',
          paddingHorizontal: 12,
          paddingVertical: 14,
          marginBottom: 12,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Text style={{ color: value ? '#0f172a' : '#64748b', fontSize: 16 }}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              maxHeight: '80%',
            }}
          >
            <Text style={{ color: '#0f172a', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
              {placeholder}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <TouchableOpacity
                    key={option.value || option.label}
                    activeOpacity={0.85}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      backgroundColor: isSelected ? '#dbeafe' : '#f8fafc',
                      borderWidth: 1,
                      borderColor: isSelected ? '#93c5fd' : '#e2e8f0',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: isSelected ? '600' : '400' }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity onPress={() => setOpen(false)} style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
