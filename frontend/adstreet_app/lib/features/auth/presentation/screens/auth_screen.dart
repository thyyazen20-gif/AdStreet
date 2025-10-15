import 'package:flutter/material.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Authentication')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                // TODO: Implement email/password login
              },
              child: const Text('Login with Email'),
            ),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement Google login
              },
              child: const Text('Login with Google'),
            ),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement Apple login
              },
              child: const Text('Login with Apple'),
            ),
          ],
        ),
      ),
    );
  }
}

