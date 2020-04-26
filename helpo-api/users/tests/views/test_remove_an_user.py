import json

import pytest
from django.http import HttpResponse
from rest_framework.test import APIClient
from django.urls import reverse


@pytest.mark.usefixtures('transactional_db')
def test_should_remove_user(authenticated_client: APIClient, an_email: str, create_default_user: None) -> None:
    url = reverse('remove_user')
    data = json.dumps({
        'email': an_email
    })
    response = authenticated_client.delete(url, data, content_type='application/json')

    assert response.status_code == 204

@pytest.mark.usefixtures('transactional_db')
def test_should_not_remove_user(authenticated_client: APIClient, another_email: str) -> None:
    url = reverse('remove_user')
    data = json.dumps({
        'email': another_email
    })
    response = authenticated_client.delete(url, data, content_type='application/json')

    print(response)
    assert response.status_code == 400