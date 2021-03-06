/*
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * The Apereo Foundation licenses this file to you under the Apache License,
 * Version 2.0, (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tle.beans.usermanagement.standard.wrapper;

import com.tle.common.settings.annotation.Property;

public class RemoteSupportSettings extends AbstractSystemUserWrapperSettings {
  private static final long serialVersionUID = 1L;

  public static final String DEFAULT_USERNAME = "TLE_SUPPORT"; // $NON-NLS-1$

  @Property(key = "wrapper.remotesupport.enabled")
  private boolean enabled;

  @Property(key = "wrapper.remotesupport.username")
  private String username;

  public RemoteSupportSettings() {
    this.username = DEFAULT_USERNAME;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  @Override
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public void setUsername(String username) {
    this.username = username;
  }
}
